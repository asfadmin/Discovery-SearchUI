# SearchUI

[![
CodeFactor](https://www.codefactor.io/repository/github/asfadmin/discovery-searchui/badge?s=fe1df8c7275093962e0c42abffa97803a397c825)](https://www.codefactor.io/repository/github/asfadmin/discovery-searchui) <img src="https://api.ghostinspector.com/v1/suites/5d408f00f1eea0544564fb2a/status-badge" title="Search UI Suite Status">

[![Join the chat at https://gitter.im/ASFDiscovery/Vertex](https://badges.gitter.im/ASFDiscovery/Vertex.svg)](https://gitter.im/ASFDiscovery/Vertex?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

 ASF's Angular search web application

## Deployments
| Maturity | Deployment |
| --- | --- |
| Devel | https://search-dev.asf.alaska.edu/ |
| Test | https://search-test.asf.alaska.edu/ |
| Prod | https://search.asf.alaska.edu/ |

### Personal Deployment (deployment.py)

- To run install the aws cli ([docs](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html))
- Then create id credentials for the Discovery-NonProd account ([docs](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey))
 - Set the credentials locally using `aws configure`, set the default region to `us-east-1` and the output format to `json`, and use the credentials generated previously.

**Example:**
```
 python deployment.py will --branch devel
```

## Initialize after downloading
After you first download the repo, set up your instance by doing `npm install` from the project root directory. If you don't have npm installed go [here](https://www.npmjs.com/get-npm) for installation instructions.

## Development server

The app is run locally using the Angular CLI. Installation instructions can be found [here](https://angular.io/cli).

After angular is installed, run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files. You can optionally supply a port number, for example `ng serve --port 4444`

### Custom Domain

In order to get certain services to work, it's necessary to set up a .asf.alaska.edu domain pointing to your local server in your host file. This process varies on the OS you are using. 

Add the following line via the methods below to set up local.asf.alaska.edu to point towards your local development server.
```
127.0.0.1   local.asf.alaska.edu
```
| OS | Method |
| --- | --- |
| Mac/Linux | modify the /etc/hosts file |
| Windows | Modify c:\windows\system32\drivers\etc\hosts as Administrator |
```
ng serve --port 4444 --host local.asf.alaska.edu
```

### Setting up HTTPS
Some services of Vertex require HTTPS to work. Angular supports running with ssl, though some browsers may not be happy with the self-signed certs and not let you access the page through HTTPS. To get around this [mkcert](https://github.com/FiloSottile/mkcert) can act as a Certificate Authority to verify the certs it generates.
1. Follow the instruction to install mkcert on their [README](https://github.com/FiloSottile/mkcert#installation)
3. Run `mkcert -install` (May need to be run as administrator)
4. To generate the certs to give to Angular run `mkcert local.asf.alaska.edu`. If you want to specify the location to generate the certs (**recommended**) you can pass the parameters `-cert-file` and `-key-file` ex: `mkcert -cert-file ~/mkcert/cert.pem -key-file ~/mkcert/key.pem local.asf.alaska.edu`
5. Run angular with the following flags to specify to use SSL and where the SSL key and cert are.
```
ng serve --host=local.asf.alaska.edu --ssl true --ssl-cert ~/mkcert/cert.pem --ssl-key ~/mkcert/key.pem 
```


## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Install NPM Packages
Run `npm install --save package_name` to install a package.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Testing
Testing run via [Ghost Inspector](https://ghostinspector.com/).

## Further help

To get more help on the Angular CLI use `ng help` or check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

More information about the app is available on the [wiki](https://github.com/asfadmin/SearchUI/wiki)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.2.4.

And again she is back.
