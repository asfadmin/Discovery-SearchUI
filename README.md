# SearchUI
[![es](https://img.shields.io/badge/lang-es-red.svg)](./README.ESP.md)
[![
CodeFactor](https://www.codefactor.io/repository/github/asfadmin/discovery-searchui/badge?s=fe1df8c7275093962e0c42abffa97803a397c825)](https://www.codefactor.io/repository/github/asfadmin/discovery-searchui) <img src="https://api.ghostinspector.com/v1/suites/5d408f00f1eea0544564fb2a/status-badge" title="Search UI Suite Status">

[![Join the chat at https://gitter.im/ASFDiscovery/Vertex](https://badges.gitter.im/ASFDiscovery/Vertex.svg)](https://gitter.im/ASFDiscovery/Vertex?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

 ASF's Angular search web application

## Deployments

### Vertex (Standard)
| Environment | Deployment |
| --- | --- |
| Development | https://vertex-devel.asf.alaska.edu/ |
| Test | https://vertex-test.asf.alaska.edu/ <br> https://search-test.asf.alaska.edu/ |
| Production | https://search.asf.alaska.edu/ |

### Vertex+ (HyP3+)
| Environment | Deployment |
| --- | --- |
| Development | https://vertex-plus-devel.asf.alaska.edu/ |
| Test | https://vertex-plus-test.asf.alaska.edu/ |
| Production | https://vertex-plus.asf.alaska.edu/ |

### Branch-Based Deployments
- **`main` branch** → Both tenants to production
- **`test` branch** → Both tenants to test
- **`vertex/*` branches** → Vertex to development
- **`vertex-plus/*` branches** → Vertex+ to development
- **Personal branches** (`{name}/{topic}`) → Automatic development deployments

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

### Multi-Tenant Builds

The application supports builds for two tenants: **Vertex** (Standard) and **Vertex+** (HyP3+).

**Vertex Builds:**
```bash
npm run build:devel:vertex      # Development
npm run build:test:vertex       # Test
npm run build:prod:vertex       # Production (default)
```

**Vertex+ Builds:**
```bash
npm run build:devel:vertex-plus # Development
npm run build:test:vertex-plus  # Test
npm run build:prod:vertex-plus  # Production
```

**Build All Configurations:**
```bash
npm run build:all               # Builds all 6 variants (2 tenants × 3 environments)
```

**Local Testing:**
```bash
npm run serve:test:vertex       # Test Vertex configuration locally
npm run serve:test:vertex-plus  # Test Vertex+ configuration locally
```

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
in use, e.g. 'assets/i18n/en.json'. Add key/value pairs to the json files using [BabelEdit](https://www.codeandweb.com/babeledit).

The 'assets/i18n/vertex.babel' file is the project file to open with BabelEdit to access all json translation files.
Use BabelEdit to add, change, and delete key/value pairs.

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
- BabelEdit project: `assets/i18n/vertex.babel`
- All user-facing text must use the translate pipe: `{{ 'KEY' | translate }}`
- Edit translations using BabelEdit, not manually

### Styling

- SCSS preprocessor with shared styles in `src/styles/`
- Angular Material theming with modern Sass module system (@use/@forward)
- Component styles use `.scss` files
- Custom theme variables in `src/styles/asf-theme-variables.scss`
- Modern Sass functions: Use `color.adjust()` instead of `lighten()`/`darken()`

**Important:** The project has been fully migrated to modern Sass (@use/@forward). Do not use deprecated @import syntax or color functions.

## Multi-Tenant Architecture

The application supports **multi-tenant deployments** from a single codebase, powering both **Vertex** (Standard) and **Vertex+** (HyP3+) with distinct feature sets and branding.

### Architecture Overview

**Single Codebase + Runtime Configuration + Feature Flags:**
- Type-safe feature flag system (17 flags)
- Tenant-specific configurations
- Build-time tenant selection (6 configurations: 2 tenants × 3 environments)
- Separate deployments per tenant
- Automated CI/CD pipeline

### Feature Flags System

The application uses a comprehensive feature flag system to control functionality across tenants:

**HyP3+ Features:**
- `SHOW_HYP3_PLUS_BRANDING` - Show Vertex+ branding and UI elements
- `ENABLE_ENTERPRISE_API` - Use enterprise HyP3 endpoints
- `SHOW_ADVANCED_PROCESSING` - Display advanced processing options

**Search Features:**
- `ENABLE_EVENT_SEARCH` - SARViews event-based search
- `ENABLE_DISPLACEMENT_SEARCH` - Displacement search
- `ENABLE_SBAS_SEARCH` - SBAS (Small Baseline Subset) search
- `ENABLE_BASELINE_SEARCH` - Baseline search
- `ENABLE_TIMESERIES_SEARCH` - Timeseries search
- `ENABLE_DERIVED_DATASETS` - Derived datasets access

**UI Features:**
- `SHOW_BETA_BANNER` - Display beta/preview banner
- `ENABLE_NEW_MAP_TOOLS` - Enable new map tools
- `SHOW_EXPORT_OPTIONS` - Export functionality
- `SHOW_DOWNLOAD_QUEUE` - Download queue management

**API Features:**
- `USE_DAAC_HYP3` - Use DAAC HyP3 vs Enterprise HyP3
- `ENABLE_BULK_DOWNLOAD` - Bulk download capabilities
- `ENABLE_CMR_SEARCH` - CMR integration
- `ENABLE_ADVANCED_FILTERS` - Advanced filter options

### Using Feature Flags

**In TypeScript:**
```typescript
import { FeatureFlagService } from '@services';
import { FeatureFlag } from '@models';

constructor(private featureFlags: FeatureFlagService) {}

// Check single flag
if (this.featureFlags.isEnabled(FeatureFlag.SHOW_HYP3_PLUS_BRANDING)) {
  // Vertex+ specific code
}

// Check multiple flags
if (this.featureFlags.areAllEnabled(FeatureFlag.ENABLE_ENTERPRISE_API, FeatureFlag.SHOW_ADVANCED_PROCESSING)) {
  // Code requiring both flags
}
```

**In Templates:**
```html
<!-- Conditional rendering -->
<div *appFeatureFlag="FeatureFlag.SHOW_HYP3_PLUS_BRANDING">
  <app-vertex-plus-feature></app-vertex-plus-feature>
</div>

<!-- With else template -->
<div *appFeatureFlag="FeatureFlag.SHOW_ADVANCED_PROCESSING; else basicProcessing">
  <app-advanced-processing></app-advanced-processing>
</div>
<ng-template #basicProcessing>
  <app-basic-processing></app-basic-processing>
</ng-template>
```

**In Routes:**
```typescript
import { featureFlagGuard } from '@guards';
import { FeatureFlag } from '@models';

const routes: Routes = [
  {
    path: 'advanced',
    component: AdvancedComponent,
    canActivate: [featureFlagGuard(FeatureFlag.SHOW_ADVANCED_PROCESSING)]
  }
];
```

### Branding System

The application uses CSS custom properties for tenant-specific branding:

- **Vertex (Standard)** - ASF Blue branding (`src/styles/brands/vertex.scss`)
- **Vertex+ (HyP3+)** - Teal branding (`src/styles/brands/vertex-plus.scss`)

The app automatically applies `.tenant-vertex` or `.tenant-vertex-plus` class to the root element based on the active tenant configuration.

### Key Files

**Feature Flag System:**
- `src/app/models/feature-flags.enum.ts` - Feature flag enum definitions
- `src/app/services/feature-flag.service.ts` - Feature flag checking service
- `src/app/guards/feature-flag.guard.ts` - Functional route guard
- `src/app/directives/feature-flag.directive.ts` - Structural directive for templates

**Tenant Configurations:**
- `src/app/models/tenant-config.interface.ts` - TypeScript interfaces for tenant config
- `src/app/services/envs/env-vertex.ts` - Vertex tenant configuration with feature flags
- `src/app/services/envs/env-vertex-plus.ts` - Vertex+ tenant configuration with feature flags
- `src/app/services/environment.service.ts` - Environment configuration management

### Documentation

For comprehensive implementation details, see:
- `MULTI_TENANT_IMPLEMENTATION_SUMMARY.md` - Complete overview of implementation
- `FEATURE_FLAGS_GUIDE.md` - Detailed feature flag usage patterns and examples
- `ON_DEMAND_TO_HYP3_PLUS_MIGRATION.md` - Migration guide for "On Demand" → "HyP3+" renaming
- `CICD_SETUP_GUIDE.md` - CI/CD pipeline configuration and AWS setup

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

## Environment Configuration

**Standard environments** in `src/environments/`:
- `environment.ts` - Development
- `environment.prod.ts` - Production

**Tenant-specific configurations** in `src/app/services/envs/`:
- `env.ts` - Default environment configuration (file replaced at build time)
- `env-vertex.ts` - Vertex tenant configuration with feature flags
- `env-vertex-plus.ts` - Vertex+ tenant configuration with feature flags

Build system uses file replacement to swap both standard environments and tenant configurations at build time based on the selected build configuration (e.g., `build:prod:vertex` uses `env-vertex.ts`, `build:prod:vertex-plus` uses `env-vertex-plus.ts`).

## Further help

To get more help on the Angular CLI use `ng help` or check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

More information about the app is available on the [wiki](https://github.com/asfadmin/SearchUI/wiki)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.2.4.
