var FS = require('fs'),
	Path = require('path'),
	readline = require('readline'),
	spawnFile = require('child_process').spawn,
	Histone = require('./Histone');

var TPL_DIR_PATH =  Path.resolve(__dirname, 'tpl');
var HTTPD_CONF_FILE = Path.resolve(__dirname, 'httpd.conf');
var DOCUMENT_ROOT = Path.resolve(__dirname, '../home') + '/';

function isUndefined(value) {
	return (value === undefined);
}

function isMap(value) {
	return (
		value instanceof Object &&
		!(value instanceof Function) &&
		!(value instanceof Array)
	);
}

function hasOwnProperty(value, name) {
	return (value !== null &&
		value !== undefined && typeof name === 'string' &&
		Object.prototype.hasOwnProperty.call(value, name));
}

function objectMerge() {
	var c, key, value;
	var result = {}, object;
	var length = arguments.length;
	for (c = 0; c < length; c++) {
		if (!isMap(object = arguments[c])) continue;
		for (key in object) {
			if (!hasOwnProperty(object, key)) continue;
			if (isUndefined(value = object[key])) {
				if (hasOwnProperty(result, key))
					delete result[key];
			} else if (hasOwnProperty(result, key) &&
				isMap(result[key]) && isMap(value)) {
				result[key] = object_merge(result[key], value);
			} else if (isMap(value)) {
				result[key] = object_merge(value);
			} else result[key] = value;
		}
	}
	return result;
}

function spawn(command, args, ret) {
	var proc = spawnFile(command, args);
	var stdout = '', stderr = '';
	proc.stdout.on('data', function (data) { stdout += data; });
	proc.stderr.on('data', function (data) { stderr += data; });
	proc.on('close', function(code) {
		if (!stdout.replace(/\n/g, '').length) stdout = '';
		if (!stderr.replace(/\n/g, '').length) stderr = '';
		ret(stdout, stderr);
	});
}

function readDirs(path, retn, retf) {
	FS.readdir(path, function(error, names) {
		forEachAsync(names, function(fileName, next) {
			if (fileName[0] === '.') return next();
			var filePath = Path.resolve(path, fileName);
			if (FS.lstatSync(filePath).isDirectory()) {
				retn(filePath, fileName, next);
			} else next();
		}, retf);
	});
}

function forEachAsync(collection, iterator, ret, index) {

	if (typeof ret !== 'function') ret = function(){};

	if (!(collection instanceof Object)) return ret();
	if (!index) index = 0;

	var keys, key, length;
	var i = -1 + index, calls = 0, looping = false;

	if (collection instanceof Array) {
		length = collection.length;
	} else {
		keys = Object.keys(collection);
		length = keys.length;
	}

	var resume = function() {
		calls += 1;
		if (looping) return;
		looping = true;
		while (calls > 0) {
			calls -= 1, i += 1;
			if (i >= length) return ret();
			key = (keys ? keys[i] : i);
			iterator(collection[key], function(flag) {
				if (flag === forEachAsync.repeat)
					i -= 1, resume();
				else if (flag === forEachAsync.stop) ret();
				else resume();
			}, key);
		}
		looping = false;
	};
	resume();
}

forEachAsync.stop = 0;
forEachAsync.repeat = 1;


function message(prefix, args) {
	console.info.apply(console.info, [prefix].concat(args));
}

function reportStatus() {
	message('[ RUNNER ]', Array.prototype.slice.call(arguments));
}

function reportError() {
	message('[ ERROR ]', Array.prototype.slice.call(arguments));
}

function getLocation(command, ret) {
	reportStatus('trying to get location of', JSON.stringify(command));
	spawn('which', [command], function(location) {
		if (location = location.replace(/\n/g, '')) {
			reportStatus(JSON.stringify(command), 'location is', JSON.stringify(location));
			ret(location);
		}
		else reportError('cant get location of', JSON.stringify(command));
	});
}

function renderTemplateToString(tpl, ret, context) {
	var tplPath = Path.resolve(TPL_DIR_PATH, tpl);
	FS.readFile(tplPath, 'UTF-8', function(error, data) {
		if (!error) return Histone(data).render(ret, context);
		reportError('error reading', tplPath, error);
	});
}

function renderTemplateToFile(tpl, file, ret, context) {
	renderTemplateToString(tpl, function(result) {
		FS.writeFile(file, result, function(error) {
			if (!error) return ret();
			reportError('error writing', file, error);
		});
	}, context);
}

function validateAnwer(validate, answer, ret) {
	if (validate instanceof RegExp) return ret(validate.test(answer));
	if (validate === 'file') return FS.lstat(answer, function(err, stats) {
		if (err) ret(false); else ret(stats.isFile());
	});
}

function dialog(questions, ret) {
	var result = {}, rl = readline.createInterface({
		input: process.stdin, output: process.stdout
	});
	forEachAsync(questions, function(question, next) {
		var text = question.question, value = question.value;
		if (question.value) text += ' (hit enter for ' + value + ')';
		rl.question('[ RUNNER ] ' + text + ': ', function(answer) {
			answer = answer.replace(/^\s+/g, '');
			answer = answer.replace(/\s+$/g, '');
			if (!answer.length) answer = (value || '');
			validateAnwer(question.validate, answer, function(isValid) {
				if (!isValid) {
					reportError('invalid value: ' + JSON.stringify(answer));
					next(forEachAsync.repeat);
				} else result[question.target] = answer, next();
			});
		});
	}, function() { rl.close(), ret(result); });
}




function renderTemplates(templates, ret, data) {
	forEachAsync(templates, function(template, ret) {
		FS.readFile(template.tpl, 'UTF-8', function(error, tpl) {
			Histone(tpl).render(function(result) {
				FS.writeFile(template.file, result, function(error) {
					if (error) console.info(error);
					ret();
				});
			}, data);
		});
	}, ret);
}

function getSettings(ret, silent) {
	var settingsFile = Path.resolve(__dirname, 'settings.json');
	reportStatus('reading configuration', settingsFile);
	FS.readFile(settingsFile, 'UTF-8', function(error, settings) {
		if (error) {
			if (silent) return ret({}, settingsFile);
			reportError('error reading configuration', settingsFile);
		}
		else try {
			settings = JSON.parse(settings);
		}
		catch (error) {
			if (silent) return ret({}, settingsFile);
			return reportError('error parsing configuration', error.toString(), true);
		}
		ret(settings, settingsFile);
	});
}

function updateHosts(settings, ret) {

	var host, hosts = [];

	reportStatus('updating virtual hosts from', DOCUMENT_ROOT);

	readDirs(DOCUMENT_ROOT, function(path, dirName, ret) {
		readDirs(path, function(path, subDirName, ret) {
			host = {documentRoot: path};
			if (subDirName === 'www') {
				host.serverName = dirName;
				host.serverAlias = 'www.' + dirName;
			} else host.serverName = subDirName + '.' + dirName;
			hosts.push(host), ret();
		}, ret);
	}, function() {
		renderTemplates([
			{file: HTTPD_CONF_FILE, tpl: Path.resolve(__dirname, 'tpl/httpd.tpl')},
			{file: settings.hostsFile, tpl: Path.resolve(__dirname, 'tpl/hosts.tpl')}
		], ret, {DOCUMENT_ROOT: DOCUMENT_ROOT, settings: settings, hosts: hosts});
	});
}




function updateConfig(ret) {
	getSettings(function(settings, settingsFile) {
		dialog([{
			question: 'Please specify port number',
			target: 'listen', validate: /^[0-9]+$/,
			value: settings.hasOwnProperty('listen') ? settings.listen : 80
		}, {
			question: 'Please specify user',
			target: 'user', validate: /^[a-zA-Z_][a-zA-Z0-9_-]*$/,
			value: settings.hasOwnProperty('user') ? settings.user : process.env['USER']
		}, {
			question: 'Please specify group',
			target: 'group', validate: /^[a-zA-Z_][a-zA-Z0-9_-]*$/,
			value: settings.hasOwnProperty('group') ? settings.group : 'staff'
		}, {
			question: 'Please specify ip',
			target: 'ip', validate: /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/,
			value: settings.hasOwnProperty('ip') ? settings.ip : '127.0.0.1'
		}, {
			question: 'Please specify hosts file location',
			target: 'hostsFile', validate: 'file',
			value: settings.hasOwnProperty('hostsFile') ? settings.hostsFile : '/etc/hosts'
		}], function(result) {
			settings = objectMerge(settings, result);
			reportStatus('updating configuration file...');
			FS.writeFile(settingsFile, JSON.stringify(settings), function(error) {
				if (!error) return ret(settingsFile);
				reportError('error writing', settingsFile, error);
			});
		});
	}, true);
}

function updateShellScript(ret) {
	reportStatus('updating shell script...');
	getLocation('node', function(nodePath) {
		var shellScriptPath = Path.resolve(__dirname, 'runner.sh');
		renderTemplateToFile('runner.tpl', shellScriptPath, function() {
			reportStatus('create shell script', shellScriptPath);
			reportStatus('checking shell script permissions...');
			FS.stat(shellScriptPath, function(error, stats) {
				if (error) { reportError(error); return; }
				var mode = (stats.mode & 07777);
				if (mode & 1 << 6) return ret(shellScriptPath);
				reportStatus('setting execuable permissions...');
				FS.chmod(shellScriptPath, mode | 1 << 6, function(error) {
					if (error) { reportError(error); return; }
					ret(shellScriptPath);
				});
			});
		}, {nodePath: nodePath, runnerPath: __filename});
	});
}

function updateAppleScripts(shellScriptPath, ret) {
	reportStatus('updating apple scripts...');
	getLocation('osacompile', function(osacompile) {
		var userScriptsDir = Path.resolve(process.env.HOME, 'Library/Scripts');
		forEachAsync(['start', 'stop', 'restart'], function(action, next) {
			renderTemplateToString('controller.tpl', function(result) {
				var appleScriptPath = Path.resolve(userScriptsDir, action + '_servers.app');
				spawn('osacompile', ['-e', result, '-o', appleScriptPath], function(out, error) {
					if (error) { reportError(error); return; }
					reportStatus('create apple script', appleScriptPath), next();
				});
			}, {shellScriptPath: shellScriptPath, action: action});
		}, ret);
	});
}




var actions = {

	start: function(ret) {
		getLocation('httpd', function(httpd) {
			getSettings(function(settings) {
				updateHosts(settings, function() {
					spawn(httpd, [
						'-c', 'Include ' + HTTPD_CONF_FILE,
						'-k', 'start'
					], function(stdout, stderr) {
						if (stdout) reportStatus(stdout);
						if (stderr) reportError(stderr);
						if (ret) ret();
					});
				});
			});
		});
	},

	stop: function(ret) {
		getLocation('httpd', function(httpd) {
			spawn(httpd, ['-k', 'stop'], function(stdout, stderr) {
				if (stdout) reportStatus(stdout);
				if (stderr) reportError(stderr);
				if (ret) ret();
			});
		});
	},

	restart: function(ret) {
		this.stop(this.start);
	},

	install: function() {
		updateConfig(function(settingsFile) {
			updateShellScript(function(shellScriptPath) {
				updateAppleScripts(shellScriptPath, function() {
					reportStatus('done everything');
				});
			});
		});
	}

};

var action = process.argv[2];
if (actions.hasOwnProperty(action))
	actions[action]();
else reportError('unknown action', action);