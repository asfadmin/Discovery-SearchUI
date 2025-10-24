# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ASF's Discovery SearchUI - An Angular-based web application for searching and discovering satellite imagery data from Alaska Satellite Facility. The application provides advanced search capabilities, map-based visualization, and on-demand processing through the HyP3 service.

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
# Production build
ng build --configuration production

# Or use npm script
npm run build
```

Build artifacts are stored in `dist/` directory.

### Testing
```bash
# Run tests
ng test

# Run tests headless (for CI)
npm test -- --browsers=ChromeHeadless --watch=false --code-coverage=false
```

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

Each domain has:
- `*.action.ts` - NgRx actions
- `*.reducer.ts` - State reducers
- `*.effects.ts` - Side effects (API calls, routing)
- `*.selectors.ts` - State selectors

### Module Organization

The app uses feature modules organized by domain:

**Core Components** (`src/app/components/`):
- `header/` - Main navigation, search controls, queue management
- `sidebar/` - Filters panel and search refinement
- `map/` - OpenLayers-based map with drawing tools
- `results-menu/` - Search results display and management
- `baseline-chart/` - Baseline visualization for InSAR
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
