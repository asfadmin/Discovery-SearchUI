# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ASF's Discovery SearchUI - An Angular-based web application for searching and discovering satellite imagery data from Alaska Satellite Facility. The application provides advanced search capabilities, map-based visualization, and on-demand processing through the HyP3 service.

## Initial Setup

After cloning the repository:
```bash
npm install
```

This installs all dependencies. If npm is not installed, see [npm installation guide](https://www.npmjs.com/get-npm).

## Common Development Commands

### Development Server
```bash
# Standard local development
ng serve

# Development with local ASF domain (required for some services)
ng serve --port 4447 --ssl true --host local.asf.alaska.edu

# Or use the npm script
npm run start_local_asf
```

**Note:** Some services require HTTPS with a custom domain. Add `127.0.0.1 local.asf.alaska.edu` to your hosts file and set up SSL certificates using mkcert (see README.md for details).

### Building
```bash
# Standard production build (defaults to Vertex)
ng build --configuration production

# Or use npm script
npm run build

# Multi-tenant builds (see Multi-Tenant Architecture section)
npm run build:prod:vertex       # Vertex production
npm run build:prod:vertex-plus  # Vertex+ production
npm run build:test:vertex       # Vertex test
npm run build:test:vertex-plus  # Vertex+ test
npm run build:all               # Build all 6 configurations
```

Build artifacts are stored in `dist/` directory.

### Testing
```bash
# Run tests (interactive with Karma)
ng test

# Run tests headless (for CI)
npm test -- --browsers=ChromeHeadless --watch=false --code-coverage=false
```

The project uses Jasmine for unit tests with Karma as the test runner. Test files use `.spec.ts` extension.

### Linting
```bash
# Run ESLint
npm run lint

# Lint specific files
eslint -c eslint.config.js src/path/to/file.ts
```

The project uses ESLint with Prettier integration. Linting rules are in `eslint.config.js` with custom configurations for TypeScript and HTML templates.

### Code Generation
```bash
# Generate component (default generates with .scss and skips tests)
ng generate component component-name

# Generate service (generates with tests)
ng generate service service-name

# Other generators
ng generate directive|pipe|guard|interface|enum|module
```

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

The application supports **multi-tenant deployments** from a single codebase:
- **Vertex (Standard)** - Deployed to `search.asf.alaska.edu`
- **Vertex+ (HyP3+)** - Deployed to `vertex-plus.asf.alaska.edu`

### Architecture Overview

**Single Codebase + Runtime Configuration + Feature Flags:**
- Type-safe feature flag system (17 flags)
- Tenant-specific configurations
- Build-time tenant selection (6 configurations)
- Separate deployments per tenant
- Automated CI/CD pipeline

**Key Files:**
- `src/app/models/feature-flags.enum.ts` - Feature flag enum definitions
- `src/app/models/tenant-config.interface.ts` - TypeScript interfaces for tenant config
- `src/app/services/envs/env-vertex.ts` - Vertex tenant configuration
- `src/app/services/envs/env-vertex-plus.ts` - Vertex+ tenant configuration
- `src/app/services/feature-flag.service.ts` - Feature flag checking service
- `src/app/guards/feature-flag.guard.ts` - Functional route guard
- `src/app/directives/feature-flag.directive.ts` - Structural directive for templates

### Feature Flags (17 Total)

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

### Build Configurations

**6 Build Configurations (2 tenants × 3 environments):**

```bash
# Vertex builds
npm run build:devel:vertex      # Development
npm run build:test:vertex       # Test
npm run build:prod:vertex       # Production

# Vertex+ builds
npm run build:devel:vertex-plus # Development
npm run build:test:vertex-plus  # Test
npm run build:prod:vertex-plus  # Production

# Build all configurations
npm run build:all               # Builds all 6 variants
```

**Serve Configurations for Local Testing:**

```bash
# Test Vertex locally
npm run serve:test:vertex
# Opens http://localhost:4200 with Vertex configuration

# Test Vertex+ locally
npm run serve:test:vertex-plus
# Opens http://localhost:4200 with Vertex+ configuration
```

### Branding System

**CSS Custom Properties** (`src/styles/tokens.scss`):
- Base design tokens for spacing, typography, colors
- Overridden per tenant in `src/styles/brands/`

**Tenant-Specific Styles:**
- `src/styles/brands/vertex.scss` - Vertex branding (ASF Blue)
- `src/styles/brands/vertex-plus.scss` - Vertex+ branding (Teal)

**Automatic Tenant Class:**
The app automatically applies `.tenant-vertex` or `.tenant-vertex-plus` class to the root element based on the active tenant configuration.

### Accessing Tenant Configuration

**Via EnvironmentService:**
```typescript
import { EnvironmentService } from '@services';

constructor(private envService: EnvironmentService) {}

// Get current tenant
const tenant = this.envService.currentTenant; // 'vertex' or 'vertex-plus'

// Check if Vertex+
if (this.envService.isVertexPlus) {
  // Vertex+ specific logic
}

// Get branding info
const appName = this.envService.branding.appName; // 'Vertex' or 'Vertex+'
const supportEmail = this.envService.branding.supportEmail;
```

### CI/CD Deployments

**Automatic Branch-Based Deployments:**
- `main` branch → Both tenants to production
- `test` branch → Both tenants to test
- `vertex/*` branches → Vertex to development
- `vertex-plus/*` branches → Vertex+ to development

**Manual Deployments:**
Use GitHub Actions UI to deploy specific tenant/environment combinations.

**Deployment Targets:**

| Tenant | Environment | URL |
|--------|-------------|-----|
| Vertex | Development | `vertex-devel.asf.alaska.edu` |
| Vertex | Test | `vertex-test.asf.alaska.edu` |
| Vertex | Production | `search.asf.alaska.edu` |
| Vertex+ | Development | `vertex-plus-devel.asf.alaska.edu` |
| Vertex+ | Test | `vertex-plus-test.asf.alaska.edu` |
| Vertex+ | Production | `vertex-plus.asf.alaska.edu` |

### Documentation

**Comprehensive guides available:**
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

## Deployments

### Vertex (Standard)
- **Development:** https://vertex-devel.asf.alaska.edu/
- **Test:** https://vertex-test.asf.alaska.edu/ (also: https://search-test.asf.alaska.edu/)
- **Production:** https://search.asf.alaska.edu/

### Vertex+ (HyP3+)
- **Development:** https://vertex-plus-devel.asf.alaska.edu/
- **Test:** https://vertex-plus-test.asf.alaska.edu/
- **Production:** https://vertex-plus.asf.alaska.edu/

### Branch-Based Deployments
- **`main` branch** → Both tenants to production
- **`test` branch** → Both tenants to test
- **`vertex/*` branches** → Vertex to development
- **`vertex-plus/*` branches** → Vertex+ to development
- **Personal branches** (`{name}/{topic}`) → Automatic development deployments

See `CICD_SETUP_GUIDE.md` for detailed deployment configuration and manual deployment options.

## Environment Configuration

**Standard environments** in `src/environments/`:
- `environment.ts` - Development
- `environment.prod.ts` - Production

**Tenant-specific configurations** in `src/app/services/envs/`:
- `env.ts` - Default environment configuration (file replaced at build time)
- `env-vertex.ts` - Vertex tenant configuration with feature flags
- `env-vertex-plus.ts` - Vertex+ tenant configuration with feature flags

Build system uses file replacement to swap tenant configurations at build time based on the selected build configuration (e.g., `build:prod:vertex` uses `env-vertex.ts`, `build:prod:vertex-plus` uses `env-vertex-plus.ts`).
