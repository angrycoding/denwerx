denwerx
=======

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
