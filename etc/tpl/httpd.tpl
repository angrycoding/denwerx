{{var port = settings.listen}}
{{var aliases = settings.aliases}}

Listen {{port}}
User {{settings.user}}
Group {{settings.group}}
DocumentRoot "{{DOCUMENT_ROOT}}"
AccessFileName .htaccess

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
    {{for alias in settings.aliases}}
        AliasMatch ^.*/\{{alias.prefix}}(.*) {{alias.path}}$1
    {{/for}}
</IfModule>

{{for alias in settings.aliases}}
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