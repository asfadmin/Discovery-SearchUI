# SearchUI

[![
CodeFactor](https://www.codefactor.io/repository/github/asfadmin/discovery-searchui/badge?s=fe1df8c7275093962e0c42abffa97803a397c825)](https://www.codefactor.io/repository/github/asfadmin/discovery-searchui) <img src="https://api.ghostinspector.com/v1/suites/5d408f00f1eea0544564fb2a/status-badge" title="Search UI Suite Status">

[![Join the chat at https://gitter.im/ASFDiscovery/Vertex](https://badges.gitter.im/ASFDiscovery/Vertex.svg)](https://gitter.im/ASFDiscovery/Vertex?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

 ASF's Angular search web application

## Deployments

- **Devel:** https://search-dev.asf.alaska.edu/
- **Test:** https://search-test.asf.alaska.edu/
- **Prod:** https://search.asf.alaska.edu/

### Personal Deployment (deployment.py)

- To run install the aws cli ([docs](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html))
- Then create id credentials for the Discovery-NonProd account ([docs](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey))
- Then set the credentials locally using `aws configure` set the default region to `us-east-1` and the output format to `json` and use the credntials that were just generated.

**Example:**
```
 python deployment.py will --branch devel
```

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
This is the starting point for installing Make Docs https://www.mkdocs.org/#installation

If you do not have python and pip already installed and you are using OS X, then these links
might be helpful.

To install Homebrew follow the directions here https://docs.python-guide.org/starting/install3/osx/

This can be helpful if you have problems installing Python or pip https://opensource.com/article/19/5/python-3-default-mac

#### python 3 and pip on OS X
For Apple OS X systems, this is the recommended approach to installing python 3 and pip.
While OS X comes with many Unix utilities, those familiar with Linux systems
will notice one key component missing: a package manager. Homebrew fills this void.

To install Homebrew follow the directions here https://docs.python-guide.org/starting/install3/osx/

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

More information about the app can be found in the [wiki](https://github.com/asfadmin/SearchUI/wiki)

## Google Tag Manager Structure

### GTM Tag Hierarchy
- Category: _Search Criteria_
  - Label: _Search Type_
    - dataLayer Variable: 'search-type': searchType
  - Label: _Dataset_
    - dataLayer Variable: 'dataset': dataset

- Category: Map
    Label: _Draw Mode_
        dataLayer Variable: 'draw-mode': drawMode


- One tall latte.
- Go to a movie.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.2.4.
