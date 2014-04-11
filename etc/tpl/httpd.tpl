# AUTO-GENERATED FILE, DO NOT MODIFY

{{var port = settings.listen}}

Listen {{port}}
User {{settings.user}}
Group {{settings.group}}
DocumentRoot "{{DOCUMENT_ROOT}}"
AccessFileName .htaccess

LoadModule php5_module libexec/apache2/libphp5.so

<IfModule php5_module>
	AddType application/x-httpd-php .php
	AddType application/x-httpd-php-source .phps
	<IfModule dir_module>
		DirectoryIndex index.html index.php
	</IfModule>
</IfModule>

<Directory />
	Options FollowSymLinks
	AllowOverride All
	Order deny,allow
	Deny from all
</Directory>

<Directory "{{DOCUMENT_ROOT}}">
	Options Indexes FollowSymLinks MultiViews
	AllowOverride All
	Order allow,deny
	Allow from all
</Directory>

<IfModule alias_module>
	{{for alias in ALIASES}}
		AliasMatch ^.*/\{{alias.prefix}}(.*) {{alias.path}}$1
	{{/for}}
</IfModule>

{{for alias in ALIASES}}
	<Directory "{{alias.path}}">
		Options Indexes FollowSymLinks MultiViews
		AllowOverride None
		Order allow,deny
		Allow from all
	</Directory>
{{/for}}

NameVirtualHost *:{{port}}

{{for host in hosts}}
	<VirtualHost *:{{port}}>
		DocumentRoot {{host.documentRoot}}
		ServerName {{host.serverName}}
		{{if host.serverAlias}}
			ServerAlias {{host.serverAlias}}
		{{/if}}
	</VirtualHost>
{{/for}}