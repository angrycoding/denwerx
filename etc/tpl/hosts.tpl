##
# Host Database
#
# localhost is used to configure the loopback interface
# when the system is booting.  Do not change this entry.
##

# AUTO-GENERATED FILE, DO NOT MODIFY

127.0.0.1	localhost
255.255.255.255	broadcasthost
::1             localhost
fe80::1%lo0	localhost

{{for host in hosts}}
{{settings.ip}}	{{host.serverName}}{{if host.serverAlias}}
{{settings.ip}}	{{host.serverAlias}}
{{/if}}{{/for}}