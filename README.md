DenwerX
=======

Set of scripts that allows you to enjoy so called "virtual hosts" or "named hosts" without installing any additional software.

* uses standard Apache and PHP5 which is installed in every OSX by default (so it won't install you another one, like most of the similar solutions does)
* doesn't modify standard Apache installation or config files, it just transparently works on top of it
* allows you to use named hosts, so instead of `http://localhost/my-project/www/index.html` you can simply use `http://my-project/` (I recomend you to create such hosts with ".loc" postfix to avoid possible confusion)
* minimal possible installation, no installers, no dmg's, you just manually copy files wherever you need and it just lives there
* elegant (MacOS way) of starting and stopping it, using AppleScript
* distribution **doesn't include MySQL**, so do it yourself if you need it

## Installation

* [download](http://nodejs.org/download/) and install Node.js if you don't have it yet
* [download ZIP archive](https://github.com/angrycoding/denwerx/archive/master.zip)
* extract it into some directory (for example into ~/Sites/)
* open terminal and go into ~/Sites/etc/ (in case if you extracted it in ~/Sites/)
* type `node denwerxctl.js install` and follow the installation process
* type `sudo visudo`, enter your root password and add `%staff ALL=NOPASSWD:~/Sites/etc/runner.sh` at the end of the file (this will let you to run Apache under root, while not being root)
* open `/Applications/Utilities/AppleScriptEditor.app` go into `Preferences...`, check `Show Script menu in menu bar` and uncheck `Show Computer scripts`.
* start DenwerX by clicking on start_servers menu item in the Script menu (will appear in the menu bar)
* open your favorite web - browser and type `http://localhost/`
