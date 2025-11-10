# SearchUI
[![es](https://img.shields.io/badge/lang-es-red.svg)](./README.ESP.md)
[![
CodeFactor](https://www.codefactor.io/repository/github/asfadmin/discovery-searchui/badge?s=fe1df8c7275093962e0c42abffa97803a397c825)](https://www.codefactor.io/repository/github/asfadmin/discovery-searchui) <img src="https://api.ghostinspector.com/v1/suites/5d408f00f1eea0544564fb2a/status-badge" title="Search UI Suite Status">

[![Join the chat at https://gitter.im/ASFDiscovery/Vertex](https://badges.gitter.im/ASFDiscovery/Vertex.svg)](https://gitter.im/ASFDiscovery/Vertex?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

 ASF's Angular search web application

## Deployments
| Maturity | Deployment |
| --- | --- |
| Test | https://search-test.asf.alaska.edu/ |
| Prod | https://search.asf.alaska.edu/ |

### Personal Deployment (deployment.py)

ASF Developers have their own personal deployments that build automatically from any branch with the matching identifier with their name `{name}/{topic}`

## Initialize after downloading
After you first download the repo, set up your instance by doing `npm install` from the project root directory. If you don't have npm installed go [here](https://www.npmjs.com/get-npm) for installation instructions.

## Code linting
This project uses eslint and prettier. Install/setup eslint in your formatter of choice, and have prettier pull from .prettierrc for custom config options.
[Eslint for Webstorm/Jetbrains](https://www.jetbrains.com/help/webstorm/eslint.html#ws_js_linters_eslint_before_you_start)
[Eslint for VSCode](https://github.com/microsoft/vscode-eslint)


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
ng serve --port 4445 --ssl true --host local.asf.alaska.edu
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

## Translating Text
The package [ngx-translate](http://www.ngx-translate.com/) is use enable multilingual support. Any text a user can view on the UI, excluding possibly
metadata values and brand names, should be displayed using a translate pipe.

Here is an example:
```
<button
  [matMenuTriggerFor]="helpMenu"
  matTooltip="{{ 'HELP_AND_INFORMATION' | translate }}"
  class="spacing nav-icon-buttons" color="basic" mat-button>
  <mat-icon class="large-icon">help_outline</mat-icon>
  <div class="text-under faint-text">{{ 'HELP' | translate }}</div>
</button>
```
You can see both text in the Tool Tip and the button text itself are both run through the 'translate' pipe: `{{ 'HELP_AND_INFORMATION' | translate }}`.
The translate pipe will translate the key e.g. 'HELP_AND_INFORMATION' and replace it with the value from the current language json file
in use, e.g. 'assets/i18n/en.json'. 

## Testing
Testing run via [Ghost Inspector](https://ghostinspector.com/).

## Architecture

### State Management (NgRx)

The application uses NgRx for centralized state management with a clear domain-based structure:

**Store Structure** (`src/app/store/`):
- `scenes` - Satellite scene data and search results
- `map` - Map state, layers, and viewport
- `filters` - Search filters and parameters
- `ui` - UI state (sidebar, modals, themes)
- `search` - Search queries and history
- `queue` - Download queue management
- `user` - User authentication and preferences
- `hyp3` - HyP3 on-demand processing jobs
- `charts` - Chart data and configurations
- `templates` - Saved search templates

Each domain has:
- `*.action.ts` - NgRx actions
- `*.reducer.ts` - State reducers
- `*.effects.ts` - Side effects (API calls, routing)
- `*.selectors.ts` - State selectors

### Module Organization

The app uses feature modules organized by domain:

**Core Components** (`src/app/components/`):
- `header/` - Main navigation, search controls, queue management
- `sidebar/` - Filters panel container
- `filters-dropdown/` - Individual filter components
- `map/` - OpenLayers-based map with drawing tools
- `results-menu/` - Search results display and management
- `baseline-chart/` - Baseline visualization for InSAR
- `sbas-chart/` - SBAS (Small Baseline Subset) visualization
- `timeseries-chart/` - Time series data visualization
- `help/` - Help documentation and tutorials
- `shared/` - Reusable components across features

**Services** (`src/app/services/`):
Key architectural services:
- `asf-api.service.ts` - Backend API integration (CMR search)
- `map.service.ts` - Map interactions and state
- `search.service.ts` - Search execution and results
- `hyp3-*.service.ts` - HyP3 on-demand processing services
- `url-state.service.ts` - Deep linking and state persistence
- `environment.service.ts` - Environment configuration management

### Path Aliases

TypeScript path aliases are configured in `tsconfig.json`:
```typescript
@components/* → src/app/components/*
@services/* → src/app/services/*
@store/* → src/app/store/*
@models/* → src/app/models/*
@pipes/* → src/app/pipes/*
@directives/* → src/app/directives/*
@shared/* → src/app/shared/*
@environments/* → src/environments/*
@testing/* → src/app/testing/*
```

Always use these aliases instead of relative imports.

### Internationalization

The app uses `ngx-translate` for multilingual support:
- Translation files: `assets/i18n/{lang}.json` (e.g., `en.json`, `es.json`)
- All user-facing text must use the translate pipe: `{{ 'KEY' | translate }}`
- Edit translations using BabelEdit, not manually

### Styling

- SCSS preprocessor with shared styles in `src/styles/`
- Angular Material theming with modern Sass module system (@use/@forward)
- Component styles use `.scss` files
- Custom theme variables in `src/styles/asf-theme-variables.scss`
- Modern Sass functions: Use `color.adjust()` instead of `lighten()`/`darken()`

**Important:** The project has been fully migrated to modern Sass (@use/@forward). Do not use deprecated @import syntax or color functions.

## Key Dependencies

- **Angular 20** - Framework
- **Angular Material 20** - UI components
- **NgRx 20** - State management
- **OpenLayers (ol)** - Map rendering
- **ngx-translate** - Internationalization
- **RxJS** - Reactive programming
- **Moment.js** - Date handling
- **D3** - Data visualization
- **TypeScript 5.9** - Language

## Development Notes

### HTTPS and Domain Setup
Many features (authentication, cookies) require:
1. Custom domain: `local.asf.alaska.edu` in hosts file
2. SSL certificates via mkcert
3. Running with `--ssl true` and cert/key paths

### Component Selector Prefix
All components must use `app-` prefix (enforced by ESLint).

### Unused Variables
Use `_` prefix for intentionally unused parameters (e.g., `_event`, `_index`) to avoid linting errors.

### Code Style
- Single quotes for strings (enforced by Prettier)
- ESLint + Prettier configured for automatic formatting
- Some rules temporarily disabled (see `eslint.config.js` comments)

### Node.js Built-in Polyfills
Angular 20's esbuild-based builder requires explicit polyfills for Node.js built-in modules. The `buffer` polyfill has been added to `src/polyfills.ts`. If other Node.js modules are needed, add them similarly.

## Deployments

- **Test:** https://search-test.asf.alaska.edu/
- **Prod:** https://search.asf.alaska.edu/
- **Personal:** Developers can deploy branches named `{name}/{topic}` automatically

## Environment Configuration

Environments are in `src/environments/`:
- `environment.ts` - Development
- `environment.prod.ts` - Production

Build uses file replacement to swap environments during production builds.

## Further help

To get more help on the Angular CLI use `ng help` or check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

More information about the app is available on the [wiki](https://github.com/asfadmin/SearchUI/wiki)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.2.4.

*** Last Updated: Oct 27, 2025
