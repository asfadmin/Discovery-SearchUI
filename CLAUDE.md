# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ASF's Discovery SearchUI - Angular 20 web application for searching satellite imagery from Alaska Satellite Facility with map visualization and on-demand HyP3 processing.

## Common Commands

```bash
# Development
ng serve                                                       # http://localhost:4200
ng serve --port 4447 --ssl true --host local.asf.alaska.edu   # With HTTPS
npm run start_local_asf                                        # Alias for above

# Build
ng build                                                       # Development build
ng build --configuration production                            # Production build
npm run build                                                  # Alias for production

# Test
ng test                                                        # Interactive with watch
ng test --include='**/my-file.spec.ts'                         # Single file
npm test -- --browsers=ChromeHeadless --watch=false            # Headless CI

# Lint
npm run lint                                                   # Lint all files
eslint -c eslint.config.js src/path/to/file.ts                 # Lint specific file

# Generate
ng generate component component-name                           # Component (.scss, no tests)
ng generate service service-name                               # Service (with tests)
ng generate directive|pipe|guard|interface|enum|module name
```

**Note:** Authentication/cookies require HTTPS + custom domain. Add `127.0.0.1 local.asf.alaska.edu` to hosts file and use mkcert for SSL (see README.md).

## Architecture

### NgRx Store (`src/app/store/`)
Domain-based structure. Each domain has `*.action.ts`, `*.reducer.ts`, `*.effects.ts`, `*.selectors.ts`:
- `scenes` - Scene data/search results
- `map` - Map state/layers/viewport
- `filters` - Search filters
- `ui` - UI state (sidebar/modals/themes)
- `search` - Queries/history
- `queue` - Download queue
- `user` - Auth/preferences
- `hyp3` - On-demand jobs
- `charts` - Chart data
- `templates` - Saved searches

**Pattern:** Components dispatch actions → Effects handle side effects (API calls) → Reducers update state → Selectors derive data → Components subscribe to selectors via async pipe.

### Components (`src/app/components/`)
- `header/` - Navigation, search controls, queue
- `sidebar/` - Filters panel
- `filters-dropdown/` - Filter components
- `map/` - OpenLayers map with drawing
- `results-menu/` - Results display
- `baseline-chart/`, `sbas-chart/`, `timeseries-chart/` - Visualizations
- `shared/` - Reusable components

### Key Services (`src/app/services/`)
- `asf-api.service.ts` - CMR search API
- `map.service.ts` - Map interactions
- `search.service.ts` - Search execution
- `hyp3-*.service.ts` - On-demand processing
- `url-state.service.ts` - Deep linking
- `environment.service.ts` - Config management

### Path Aliases (`tsconfig.json`)
Always use these instead of relative imports:
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

### Internationalization
- Uses `ngx-translate` with translation files in `assets/i18n/{lang}.json`
- Edit translations via BabelEdit (`assets/i18n/vertex.babel`) only
- All user-facing text: `{{ 'KEY' | translate }}`

### Styling
- SCSS with modern Sass (@use/@forward, no @import)
- Angular Material theming
- Shared styles in `src/styles/`
- Use `color.adjust()` not deprecated `lighten()`/`darken()`

### Templates
- **Modern Control Flow:** Use `@if`, `@for`, `@else` syntax (Angular 17+)
- Do NOT use deprecated `*ngIf`, `*ngFor`, `*ngSwitch` directives
- All templates migrated to modern syntax as of 2025-11
- `@for` requires `track` expression: `@for (item of items; track item.id)`
- Loop variables: `$index`, `$first`, `$last`, `$even`, `$odd`

## Key Dependencies

Angular 20, Angular Material 20, NgRx 20, OpenLayers, ngx-translate, RxJS, Moment.js, D3, TypeScript 5.9

## Development Notes

- **Component prefix:** `app-` (enforced by ESLint)
- **Unused params:** Prefix with `_` (e.g., `_event`, `_index`)
- **Code style:** Single quotes, ESLint + Prettier
- **Polyfills:** Angular 20 esbuild requires explicit Node.js polyfills in `src/polyfills.ts`
- **Build output:** Production builds go to `dist/search-ui/`

## Deployments

- **Prod:** https://search.asf.alaska.edu/
- **Test:** https://search-test.asf.alaska.edu/
- **Personal:** Auto-deploys from branches named `{name}/{topic}`

## Environments

`src/environments/` - File replacement during build swaps `environment.ts` (dev) with `environment.prod.ts` (prod).
