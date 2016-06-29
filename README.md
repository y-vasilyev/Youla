# This is the main repo for web front end

This is the main repo for website front end.

# How to run mobile web locally


To run mobile web locally your system needs to have below items.

* Node.js should be installed locally [https://nodejs.org](https://nodejs.org "https://nodejs.org").
* Yeoman generator [http://yeoman.io/](http://yeoman.io/ "http://yeoman.io/").
* Any text editor, recommended sublime text or webstrom.


## Steps to follow

1. Install Node.js running there node installer for windows or mac.
2. Once  node install goto terminal run `node -v` to check its installed correctly.
3. To install Yeoman just run `npm install -g yo` into terminal window, if you get any error use `sudo npm install -g yo`
5. Install bower if not installed already. Run `npm install -g bower`, if you get any error use `sudo npm install -g bower`
6. Install grunt if not installed already. Run `npm install -g grunt-cli`, if you get any error use `sudo npm install -g grunt-cli`
7. Create empty folder running `mkdir project` into terminal and cd into new created folder.
8. Clone project from bitbucket (if you need permission ask).
9. Once you clone repo. inside cloned folder run `npm install`  and `bower install` (windows user need to `npm install win-spawn`)
10. Run `grunt serve` from terminal.
11. Congratulations your mobile web is up and running.


**Note**
Some stupid bugs might come across while doing setup, have some  patience and google it.

# Good to know

* To run application on different port you can use below command.

    ``grunt serve -p 9000``

* To run application on IP

	``grunt serve --address 192.168.200.66``

* To get more info from terminal while running application use below flag

	``grunt serve --verbose``

* If you got error something like connection refuse etc even grunt serve successful add below line

       ``sudo npm uninstall grunt-concurrent``
       ``sudo npm install grunt-concurrent@1.0.0``



ui-grid:
https://github.com/angular-ui/ui-grid/


times:
https://github.com/indrimuska/angular-moment-picker
http://momentjs.com/docs/

popup:
https://github.com/likeastore/ngDialog
