# SearchUI

[![CodeFactor](https://www.codefactor.io/repository/github/asfadmin/discovery-searchui/badge?s=fe1df8c7275093962e0c42abffa97803a397c825)](https://www.codefactor.io/repository/github/asfadmin/discovery-searchui) <img src="https://api.ghostinspector.com/v1/suites/5d408f00f1eea0544564fb2a/status-badge" title="Search UI Suite Status">

 ASF's Angular search web application

## Deployments

- **Devel:** https://search-dev.asf.alaska.edu/
- **Test:** https://search-test.asf.alaska.edu/
- **Prod:** https://search.asf.alaska.edu/


This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.2.4.

## Intialize after downloading
After you first download the repo, setup your instance by doing `npm install` from the project root directory. If you don't have npm installed go [here](https://www.npmjs.com/get-npm) for installation instructions. 

## Development server

The app is run locally using the Angular CLI. Installation instructions can be found [here](https://angular.io/cli). After angular is installed, run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files. You can optionally supply a port number, for example `ng serve --port 4444`
If you change your host file on your local machine then this command might be appropriate `ng serve --port 4444 --host local.asf.alaska.edu`.


## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Install NPM Packages
Run `npm install --save package_name` to install a package.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Installing pip and mkDocs

Install pip: 
`curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py`

Then run the following command in the folder where you have downloaded get-pip.py:
`python get-pip.py`

You can upgrade pip at anytime, or make sure you are have the latest version
installed using the command: `pip install -U pip`

#### python 3 and pip on OS X
For Apple OS X systems, this is the recommended approach to installing python 3 and pip.
While OS X comes with a large number of Unix utilities, those familiar with Linux systems
will notice one key component missing: a package manager. Homebrew fills this void.

To install Homebrew, open Terminal or your favorite OS X terminal emulator and run

`$ ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`

The script will explain what changes it will make and prompt you before the installation begins. Once you’ve installed Homebrew, insert the Homebrew directory at the top of your PATH environment variable. You can do this by adding the following line at the bottom of your ~/.profile file

`export PATH="/usr/local/opt/python/libexec/bin:$PATH"`

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

More information about the app can be found in the [wiki](https://github.com/asfadmin/SearchUI/wiki)
