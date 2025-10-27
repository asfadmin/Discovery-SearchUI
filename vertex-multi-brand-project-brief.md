# Vertex Multi-Tenant Project Implementation Guide

## Executive Summary

**What:** Transform Vertex (Discovery-SearchUI) into a multi-tenant application supporting multiple branded deployments from a single codebase.

**Why:** Support both standard Vertex and a new "Vertex+" (HyP3+) branded version without code duplication or forking.

**How:** Implement runtime configuration system with build-time asset swapping, type-safe feature flags, and TypeScript configuration. One codebase, multiple builds, separate deployments.

**Technology:**
- Angular 20 (standalone components, functional guards)
- TypeScript configuration interfaces and enums
- Type-safe feature flag system
- SCSS design tokens with CSS custom properties

**Tenants:**
- **Vertex** → `search.asf.alaska.edu`
- **Vertex+** → `vertex-plus.asf.alaska.edu`

**Approach:** Option A from Multi-Brand Guide (Single App + Runtime Configuration + Feature Flags)

---

## Project Overview
This project implements a **multi-tenant architecture** for the Vertex application (Discovery-SearchUI) to support multiple branded deployments from a single codebase. The initial implementation will support:
- **Standard Vertex** - `search.asf.alaska.edu`
- **Vertex+ (HyP3+)** - `vertex-plus.asf.alaska.edu`

**Architecture Decision:** Single app with runtime branding/configuration (Option A)
**Deployment Strategy:** Separate subdomains for each tenant/brand

---

## Angular 20 Specific Considerations

This project uses **Angular 20**, which has some important patterns to follow:

### Standalone Components & Directives
- Prefer standalone components and directives with `standalone: true`
- Use `imports` array in component metadata instead of NgModules
- The FeatureFlagDirective should be standalone

### Functional Guards
- Use functional guards with `CanActivateFn` type
- Use `inject()` function for dependency injection in guards
- Example: `featureFlagGuard(flag: FeatureFlag): CanActivateFn`

### Modern Dependency Injection
- Use `inject()` function in guards and interceptors
- Constructor injection still works in services and components
- Functional approach is preferred for Angular 20

### Signal-Based State (Optional Enhancement)
- Consider using signals for reactive feature flag state
- Can make UI more responsive to runtime flag changes
- Example: `readonly isEnabled = computed(() => this.featureFlags.isEnabled(flag))`

### Build Optimizations
- Angular 20 has improved tree-shaking
- Lazy loading with standalone components is more efficient
- Use `@defer` for conditional rendering of heavy components

### TypeScript Support
- Angular 20 requires TypeScript 5.5+
- Use strict mode for better type safety
- Leverage template type checking

---

## Repository
**Main Repo:** https://github.com/asfadmin/Discovery-SearchUI/tree/andy/vertex-multi-tenant-1
**Angular Version:** Angular 20
**Language:** TypeScript (use .ts for configuration where appropriate)

## Reference Documents

### 1. HyP3+ / Vertex+ Domain Switching Document
**Link:** https://docs.google.com/document/d/1lOkG95Cbd8UTtPVoX8SJm5E7MIQ4qfMX2PmfWLSIbdE/edit

**Key Topics Covered:**
- Static domain considerations
- URL structure: `https://search.asf.alaska.edu/#/enterprise` vs `https://vertex-plus.asf.alaska.edu/#/`
- Manual switching options vs automatic detection
- Cookie persistence across domains
- Renaming "On Demand" to "HyP3+" across all locations
- Multi-app Angular project approaches
- Breaking HyP3 & HyP3+ API services into separate libraries

**Technical Approaches Discussed:**
- Feature flags implementation
- Build pipeline options (already used for test/prod with configuration files)
- Separate API service for feature flags
- Modularization of components
- Different "apps" for different functionality (monorepo approach)

**Infrastructure Considerations:**
- Where to host "enterprise" mode:
  - `vertex-plus.asf.alaska.edu` (separate subdomain)
  - `search.asf.alaska.edu/enterprise/` (same domain, different path)

### 2. Vertex Multi-Brand Guide
**Link:** https://docs.google.com/document/d/17fl_cpvOPpsTumjMwAfZzFcRntbUSlgeLhTX_KfV0v4/edit

**Key Decision Framework:**
The document provides a scorecard for deciding between single app with branding vs multi-app approach:

Give 1 point for each "Yes":
- Different app shell or navigation?
- ≥ 20-30% unique routes or screens?
- Different auth provider/flow/scopes?
- Different API contracts (not just hosts/keys)?
- Build-time differences that can't be runtime toggled?
- Independent release cadence or compliance needs?
- Bundle bloat without clean lazy-loading?

**Score ≥ 4 → Multi-app (separate apps/<brand> shells)**
**Score ≤ 3 → Single app (branding + feature flags)**

**Option A: Single App + Branding/Flags (RECOMMENDED STARTING POINT)**

Key implementation details:
1. **Runtime Configuration Service (AppConfigService)**
   - Loads `assets/app-config.json` at startup via APP_INITIALIZER
   - Provides brand-specific settings without rebuilding
   - Supports GA IDs, API hosts, feature flags, brand names

2. **Design Tokens & SCSS Branding**
   - Base tokens in `src/styles/tokens.scss`
   - Brand overrides in `src/styles/brands/<brand>.scss`
   - Use CSS custom properties for runtime flexibility
   - Use file replacements in angular.json to swap brand.scss

3. **Asset Management**
   - Brand-specific logos, favicons in `src/assets/brands/<brand>/`
   - File replacement strategy for build-time asset selection

4. **i18n Overrides**
   - Default translations in `assets/i18n/en.json`
   - Brand-specific overrides in `assets/i18n/brands/<brand>/en.json`
   - Merge at runtime so brand keys win

5. **Feature Flags & Lazy Modules**
   - Route-level protection via guards reading featureFlags
   - Avoid scattering `if (brand)` across components
   - Prefer route-level composition

6. **Build Configurations**
   - Multiple configurations in angular.json for each brand × environment
   - File replacements for:
     - app-config.json
     - brand.scss
     - favicon.ico
     - brand-specific assets

7. **CI/CD Matrix Deploys**
   - GitHub Actions matrix: brand × environment
   - Deploy to distinct paths/buckets per brand
   - Example: 6 variants (vertex/altbrand × devel/test/prod)

## Technical Stack & Current Architecture

### Current Vertex Architecture (from docs)

**Search Types as Modules:**
- Geographic & List
- Baseline & SBAS
- Displacement
- On Demand (to be renamed HyP3+)
- Event Search
- Derived Datasets

**State Management (Store):**
- charts, filters, map, queue, scenes, search, templates, ui, hyp3, user

**Key Services:**
- ASF API, Auth, Banner API, Browse Map, CMR services
- HyP3 services (api, job polling, job status, on-demand)
- Map services (draw, layer, map)
- Product, Scenes, Search services

**API Endpoints:**
- SearchAPI (`/params` and `/baseline` endpoints)
- HyP3 endpoint
- API gateway endpoint (for event search)
- Displacement API

### Technology Considerations

**Angular Features to Leverage:**
- Multiple projects support: https://v18.angular.dev/reference/configs/file-structure#multiple-projects
- Library creation: https://angular.dev/tools/libraries/creating-libraries
- Lazy loading with defer: https://angular.dev/guide/templates/defer

**Monorepo Tools (if needed later):**
- Nx.dev: https://nx.dev/
- Turborepo: https://turborepo.com/

**Build Configuration:**
- Already using configuration files for test/prod
- Already using "maturities" panel options for API configuration
- Reference: https://github.com/asfadmin/Discovery-SearchUI/blob/test/.github/workflows/search-ui-deploy-composite/action.yml#L42

## Conversation History & Decisions

### Initial Request
User requested a text file with project instructions and links to included files, formatted for use by Claude Code.

### Key Decisions Made

**1. Scope of Instructions**
- High-level project overview that provides Claude Code with a good starting point
- File will be included in the project repository
- Claude Code will use this as a starting point to modify code

**2. Architecture Approach**
- Implement multi-tenant approach (Option A: Single App + Runtime Configuration)
- Use separate subdomains for each tenant/brand:
  - Standard Vertex: `search.asf.alaska.edu`
  - Vertex+/HyP3+: `vertex-plus.asf.alaska.edu`

**3. Implementation Strategy**
- Start with AppConfigService as foundation
- Implement design token system for branding
- Use angular.json configurations for tenant × environment matrix
- Set up CI/CD pipeline for automated deployments
- Leverage existing configuration patterns in Vertex codebase

### Developer Context
- Experienced software developer with moderate Angular skills
- Prefers clarifying questions before detailed explanations
- Working on branch: `andy/vertex-multi-tenant-1`

## Implementation Strategy

### Multi-Tenant Architecture (Single App with Runtime Configuration)

We're implementing **Option A** from the Multi-Brand Guide: a single Angular application that adapts its behavior based on runtime configuration. This approach:

✓ Maintains a single codebase  
✓ Reduces maintenance overhead  
✓ Allows independent deployments per tenant  
✓ Supports tenant-specific branding, features, and API endpoints  
✓ Can scale to additional tenants in the future

### Subdomain Strategy

Each tenant deploys to its own subdomain:
- **Vertex (standard):** `search.asf.alaska.edu`
- **Vertex+ (HyP3+):** `vertex-plus.asf.alaska.edu`

**Benefits of subdomain approach:**
- Clear separation for analytics and traffic monitoring
- Independent SSL certificates and CDN configurations
- Easier infrastructure management vs path-based routing
- Login cookies can persist across subdomains on same root domain (`asf.alaska.edu`)

### Key Components to Implement

1. **AppConfigService** - Runtime configuration loader
2. **Feature Flag Service** - Type-safe feature flag management system
3. **Design Token System** - CSS variables + SCSS brand overrides
4. **Build Matrix** - angular.json configurations for tenant × environment
5. **CI/CD Pipeline** - GitHub Actions matrix for automated builds/deploys
6. **Asset Management** - Tenant-specific logos, favicons, images

---

## Feature Flag System Design

### Overview
Feature flags allow us to enable/disable functionality per tenant without code branching. This is essential for managing differences between Vertex and Vertex+ deployments.

### Architecture

**1. Feature Flag Enum (Type Safety)**
```typescript
// src/app/core/models/feature-flags.enum.ts
export enum FeatureFlag {
  // HyP3+ Features
  SHOW_HYP3_PLUS_BRANDING = 'showHyp3PlusBranding',
  ENABLE_ENTERPRISE_API = 'enableEnterpriseApi',
  SHOW_ADVANCED_PROCESSING = 'showAdvancedProcessing',
  
  // Search Features
  ENABLE_EVENT_SEARCH = 'enableEventSearch',
  ENABLE_DISPLACEMENT_SEARCH = 'enableDisplacementSearch',
  ENABLE_SBAS_SEARCH = 'enableSbasSearch',
  
  // UI Features
  SHOW_BETA_BANNER = 'showBetaBanner',
  ENABLE_NEW_MAP_TOOLS = 'enableNewMapTools',
  SHOW_EXPORT_OPTIONS = 'showExportOptions',
  
  // API Features
  USE_DAAC_HYP3 = 'useDaacHyp3',
  ENABLE_BULK_DOWNLOAD = 'enableBulkDownload',
}
```

**2. Feature Flag Service**
```typescript
// src/app/core/services/feature-flag.service.ts
import { Injectable } from '@angular/core';
import { AppConfigService } from './app-config.service';
import { FeatureFlag } from '../models/feature-flags.enum';

@Injectable({ providedIn: 'root' })
export class FeatureFlagService {
  constructor(private configService: AppConfigService) {}

  /**
   * Check if a feature flag is enabled
   * @param flag - Feature flag to check
   * @param defaultValue - Default value if flag not found (default: false)
   */
  isEnabled(flag: FeatureFlag, defaultValue = false): boolean {
    const flags = this.configService.get<Record<string, boolean>>('featureFlags', {});
    return flags[flag] ?? defaultValue;
  }

  /**
   * Get all enabled feature flags
   */
  getEnabledFlags(): FeatureFlag[] {
    const flags = this.configService.get<Record<string, boolean>>('featureFlags', {});
    return Object.entries(flags)
      .filter(([_, enabled]) => enabled)
      .map(([key, _]) => key as FeatureFlag);
  }

  /**
   * Check if all specified flags are enabled
   */
  areAllEnabled(...flags: FeatureFlag[]): boolean {
    return flags.every(flag => this.isEnabled(flag));
  }

  /**
   * Check if any specified flags are enabled
   */
  isAnyEnabled(...flags: FeatureFlag[]): boolean {
    return flags.some(flag => this.isEnabled(flag));
  }
}
```

**3. Route Guards for Feature-Gated Routes**
```typescript
// src/app/core/guards/feature-flag.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { FeatureFlagService } from '../services/feature-flag.service';
import { FeatureFlag } from '../models/feature-flags.enum';

export function featureFlagGuard(flag: FeatureFlag): CanActivateFn {
  return () => {
    const featureFlags = inject(FeatureFlagService);
    const router = inject(Router);

    if (featureFlags.isEnabled(flag)) {
      return true;
    }

    // Redirect to home if feature not enabled
    return router.createUrlTree(['/']);
  };
}
```

**4. Structural Directive for Template Usage**
```typescript
// src/app/core/directives/feature-flag.directive.ts
import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { FeatureFlagService } from '../services/feature-flag.service';
import { FeatureFlag } from '../models/feature-flags.enum';

@Directive({
  selector: '[appFeatureFlag]',
  standalone: true
})
export class FeatureFlagDirective implements OnInit {
  @Input() appFeatureFlag!: FeatureFlag;
  @Input() appFeatureFlagElse?: TemplateRef<any>;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private featureFlagService: FeatureFlagService
  ) {}

  ngOnInit() {
    const isEnabled = this.featureFlagService.isEnabled(this.appFeatureFlag);
    
    if (isEnabled) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else if (this.appFeatureFlagElse) {
      this.viewContainer.createEmbeddedView(this.appFeatureFlagElse);
    } else {
      this.viewContainer.clear();
    }
  }
}
```

### Usage Examples

**In Routes:**
```typescript
// app-routing.module.ts
import { featureFlagGuard } from './core/guards/feature-flag.guard';
import { FeatureFlag } from './core/models/feature-flags.enum';

const routes: Routes = [
  {
    path: 'advanced-processing',
    loadComponent: () => import('./features/advanced-processing/advanced-processing.component'),
    canActivate: [featureFlagGuard(FeatureFlag.SHOW_ADVANCED_PROCESSING)]
  }
];
```

**In Templates:**
```html
<!-- Show content only if flag is enabled -->
<div *appFeatureFlag="FeatureFlag.SHOW_HYP3_PLUS_BRANDING">
  <h1>Welcome to HyP3+</h1>
</div>

<!-- Show alternate content if flag is disabled -->
<ng-container *appFeatureFlag="FeatureFlag.ENABLE_NEW_MAP_TOOLS; else oldTools">
  <app-new-map-tools></app-new-map-tools>
</ng-container>
<ng-template #oldTools>
  <app-legacy-map-tools></app-legacy-map-tools>
</ng-template>
```

**In Components:**
```typescript
export class MyComponent {
  constructor(
    private featureFlags: FeatureFlagService,
    public FeatureFlag = FeatureFlag // Make enum accessible in template
  ) {}

  ngOnInit() {
    if (this.featureFlags.isEnabled(FeatureFlag.ENABLE_BULK_DOWNLOAD)) {
      this.initBulkDownload();
    }
  }
}
```

### Configuration File Structure (TypeScript)

**Config Interface:**
```typescript
// src/app/core/models/app-config.interface.ts
import { FeatureFlag } from './feature-flags.enum';

export interface AppConfig {
  tenant: 'vertex' | 'vertex-plus';
  environment: 'devel' | 'test' | 'prod';
  gaMeasurementId?: string;
  apiBaseUrl: string;
  hyp3ApiUrl: string;
  featureFlags: Partial<Record<FeatureFlag, boolean>>;
  branding: {
    appName: string;
    orgName: string;
    supportEmail: string;
  };
}
```

**Example Config (JSON - loaded at runtime):**
```json
// src/assets/config/vertex-plus/app-config.prod.json
{
  "tenant": "vertex-plus",
  "environment": "prod",
  "gaMeasurementId": "G-XXXXXXXXXX",
  "apiBaseUrl": "https://api.vertex-plus.asf.alaska.edu",
  "hyp3ApiUrl": "https://hyp3-api-enterprise.asf.alaska.edu",
  "featureFlags": {
    "showHyp3PlusBranding": true,
    "enableEnterpriseApi": true,
    "showAdvancedProcessing": true,
    "enableEventSearch": true,
    "useDaacHyp3": false
  },
  "branding": {
    "appName": "Vertex+",
    "orgName": "Alaska Satellite Facility",
    "supportEmail": "support-plus@asf.alaska.edu"
  }
}
```

### Benefits of This Approach

✓ **Type Safety** - Enum prevents typos and provides autocomplete  
✓ **Centralized** - All flags defined in one place  
✓ **Flexible** - Can toggle features per tenant without code changes  
✓ **Testable** - Easy to mock and test different flag combinations  
✓ **Clean Code** - No scattered if/else checks throughout codebase  
✓ **Documentation** - Enum serves as living documentation of all flags

---

## Implementation Roadmap

### Phase 1: Core Infrastructure Setup

**1.1 Create TypeScript Configuration Models**
- **File:** `src/app/core/models/app-config.interface.ts`
- **File:** `src/app/core/models/feature-flags.enum.ts`
- **Purpose:** Type-safe configuration and feature flag definitions
- **Benefits:** Autocomplete, compile-time checks, living documentation

**1.2 Create AppConfigService**
- **File:** `src/app/core/services/app-config.service.ts`
- **Purpose:** Load and provide access to runtime configuration
- **Features:**
  - Fetch `assets/app-config.json` at startup via APP_INITIALIZER
  - Type-safe access via AppConfig interface
  - Error handling for missing/invalid config
  - Support for typed get() method with fallbacks

**1.3 Create FeatureFlagService**
- **File:** `src/app/core/services/feature-flag.service.ts`
- **Purpose:** Type-safe feature flag checking
- **Features:**
  - isEnabled(flag) - Check single flag
  - areAllEnabled(...flags) - Check multiple flags (AND)
  - isAnyEnabled(...flags) - Check multiple flags (OR)
  - getEnabledFlags() - Get all enabled flags

**1.4 Create Feature Flag Guard**
- **File:** `src/app/core/guards/feature-flag.guard.ts`
- **Purpose:** Protect routes based on feature flags
- **Features:**
  - Functional guard compatible with Angular 20
  - Redirects to home if feature disabled
  - Type-safe flag checking

**1.5 Create Feature Flag Directive**
- **File:** `src/app/core/directives/feature-flag.directive.ts`
- **Purpose:** Conditional template rendering based on flags
- **Features:**
  - Standalone directive (Angular 20 style)
  - Support for else templates
  - Structural directive (*appFeatureFlag syntax)

**1.6 Create Configuration Files (JSON)**
- **Structure:**
  ```
  src/assets/config/
    vertex/
      app-config.devel.json
      app-config.test.json
      app-config.prod.json
    vertex-plus/
      app-config.devel.json
      app-config.test.json
      app-config.prod.json
  ```
- **Contents:** Conform to AppConfig interface (tenant, environment, API URLs, feature flags, branding)

**1.7 Initialize Analytics Service (Optional)**
- **File:** `src/app/core/services/analytics.service.ts`
- **Purpose:** Initialize Google Analytics with tenant-specific measurement ID
- **Integration:** Called from APP_INITIALIZER after config loads

### Phase 2: Design System & Branding

**2.1 Establish Design Token System**
- **Base tokens:** `src/styles/tokens.scss`
  - CSS custom properties: colors, spacing, radii, shadows, typography
  - SCSS variables for backward compatibility
  
- **Brand overrides:** 
  - `src/styles/brands/vertex.scss` (standard Vertex theme)
  - `src/styles/brands/vertex-plus.scss` (HyP3+ theme)
  
- **Active brand:** `src/styles/brand.scss` (file replacement target)

**2.2 Brand-Specific Assets**
```
src/assets/brands/
  vertex/
    logo.svg
    favicon.ico
    [other brand assets]
  vertex-plus/
    logo.svg
    favicon.ico
    [other brand assets]
```

**2.3 Update Global Styles**
- Modify `src/styles.scss` to import:
  ```scss
  @use 'styles/tokens';
  @use 'styles/brand';
  ```

### Phase 3: Build Configuration

**3.1 Add Tenant × Environment Configurations to angular.json**

Add configurations for each combination:
- `devel-vertex`, `test-vertex`, `prod-vertex`
- `devel-vertex-plus`, `test-vertex-plus`, `prod-vertex-plus`

Each configuration uses `fileReplacements` to swap:
- `src/styles/brand.scss` → correct brand SCSS
- `src/assets/app-config.json` → correct config JSON
- `src/favicon.ico` → correct favicon

**3.2 Update Package Scripts**
Add build scripts for each tenant × environment:
```json
"build:vertex:devel": "ng build --configuration=devel-vertex",
"build:vertex-plus:prod": "ng build --configuration=prod-vertex-plus",
...
```

### Phase 4: Feature Flags & Tenant-Specific Functionality

**4.1 Define Feature Flags for Tenant Differences**
Add flags to `FeatureFlag` enum for:
- HyP3+ branding vs standard Vertex branding
- Enterprise API vs standard API endpoints
- Advanced processing features
- Search type availability (event, displacement, SBAS)
- UI features that differ between tenants

**4.2 Rename "On Demand" to "HyP3+"**
- Update UI components, labels, and translations
- Use feature flag `SHOW_HYP3_PLUS_BRANDING` to control naming
- Update search type names and queue names
- Modify:
  - Component templates with "On Demand" text
  - Translation files (English/Spanish)
  - Service names and constants

**4.3 Implement Feature-Gated Routes**
- Apply `featureFlagGuard()` to tenant-specific routes
- Examples:
  - Advanced processing page (Vertex+ only)
  - Enterprise dashboard features
  - Beta/experimental features
- Ensure graceful fallback to home page

**4.4 Update Components with Feature Flags**
- Replace hard-coded tenant checks with feature flag checks
- Use `*appFeatureFlag` directive in templates
- Use `FeatureFlagService.isEnabled()` in component logic
- Examples:
  - Show/hide navigation items
  - Enable/disable export options
  - Toggle map tools
  - Conditional API calls

**4.5 Configure Tenant-Specific Feature Flags**
Update each tenant's config files:

**Vertex (Standard):**
```json
"featureFlags": {
  "showHyp3PlusBranding": false,
  "enableEnterpriseApi": false,
  "showAdvancedProcessing": false,
  "enableEventSearch": true,
  "useDaacHyp3": true
}
```

**Vertex+:**
```json
"featureFlags": {
  "showHyp3PlusBranding": true,
  "enableEnterpriseApi": true,
  "showAdvancedProcessing": true,
  "enableEventSearch": true,
  "useDaacHyp3": false
}
```

**4.6 i18n Translation Overrides (Optional)**
If copy differs significantly:
```
assets/i18n/
  en.json                          # default translations
  es.json
  brands/
    vertex-plus/
      en.json                      # override keys for HyP3+ terminology
      es.json
```

Merge brand-specific translations at runtime after loading defaults.

### Phase 5: CI/CD Pipeline

**5.1 Create GitHub Actions Matrix Build**
- **File:** `.github/workflows/build-and-deploy.yml`
- **Matrix:** `{tenant: [vertex, vertex-plus], env: [devel, test, prod]}`
- **Steps:**
  1. Checkout code
  2. Install dependencies
  3. Build with correct configuration
  4. Upload artifacts
  5. Deploy to tenant-specific S3 bucket + CloudFront

**5.2 Configure Deployment Targets**
- Set up GitHub Secrets for each tenant × environment:
  - S3 bucket names
  - CloudFront distribution IDs
  - AWS credentials

### Phase 6: Domain & Cookie Configuration

**6.1 Cookie Persistence**
- Verify login cookies are set on `.asf.alaska.edu` domain
- Ensures auth persists when switching between subdomains
- Test cookie sharing between `search.asf.alaska.edu` and `vertex-plus.asf.alaska.edu`

**6.2 Redirects & Notifications (Future)**
- Implement loading screen when switching between tenants
- Handle legacy URL redirects if needed
- User notification when being redirected to different subdomain

## Technical Debt & Future Considerations

**Areas to Improve:**
- Breaking out larger stores into search-type-specific categories
- Modularizing components (displacement, event search, SBAS, baseline)
- Bundle size optimization via lazy loading
- Consider using defer for layout shift prevention

**Research References:**
- Twelve Factor App: https://12factor.net/
- Feature Toggles: https://martinfowler.com/articles/feature-toggles.html
- Angular Build Once Deploy Multiple: https://timdeschryver.dev/blog/angular-build-once-deploy-to-multiple-environments
- Monorepo Tools: https://monorepo.tools/

---

## File Changes Overview

### New Files to Create

**Core Models (TypeScript):**
```
src/app/core/models/
  ├── app-config.interface.ts        # TypeScript interface for config
  └── feature-flags.enum.ts          # Enum for all feature flags
```

**Core Services:**
```
src/app/core/services/
  ├── app-config.service.ts          # Runtime config loader
  ├── feature-flag.service.ts        # Feature flag checking service
  └── analytics.service.ts           # GA initialization (optional)
```

**Core Guards:**
```
src/app/core/guards/
  └── feature-flag.guard.ts          # Route guard for feature flags
```

**Core Directives:**
```
src/app/core/directives/
  └── feature-flag.directive.ts      # Structural directive for templates
```

**Configuration Files (JSON):**
```
src/assets/config/
  ├── vertex/
  │   ├── app-config.devel.json
  │   ├── app-config.test.json
  │   └── app-config.prod.json
  └── vertex-plus/
      ├── app-config.devel.json
      ├── app-config.test.json
      └── app-config.prod.json
```

**Design System:**
```
src/styles/
  ├── tokens.scss                    # Base design tokens
  ├── brand.scss                     # Placeholder (file replacement target)
  └── brands/
      ├── vertex.scss                # Vertex brand overrides
      └── vertex-plus.scss           # Vertex+ brand overrides
```

**Brand Assets:**
```
src/assets/brands/
  ├── vertex/
  │   ├── logo.svg
  │   └── favicon.ico
  └── vertex-plus/
      ├── logo.svg
      └── favicon.ico
```

**CI/CD:**
```
.github/workflows/
  └── build-and-deploy-multitenant.yml   # Matrix build workflow
```

### Files to Modify

**Angular Configuration:**
```
angular.json                         # Add 6 build configurations
```

**Module Setup:**
```
src/app/app.module.ts               # Add APP_INITIALIZER for AppConfigService
```

**Global Styles:**
```
src/styles.scss                     # Import tokens and brand
```

**Build Scripts:**
```
package.json                        # Add tenant × environment build scripts
```

**Git Ignore:**
```
.gitignore                          # Ignore build-time replacement files
```

### Files to Reference (Don't Modify Yet)

**Existing Services to Potentially Adapt:**
```
src/app/services/
  ├── auth.service.ts               # May need tenant-aware auth
  ├── hyp3/                         # HyP3 API services
  └── asf-api.service.ts            # May need tenant-specific URLs
```

**Components to Update for "HyP3+" Rename:**
```
src/app/components/
  └── [various components with "On Demand" references]
```

---

## Starting Points for Claude Code

### Step 1: Review Current Code Structure
```bash
# Examine existing configuration system
src/app/core/services/
src/app/core/models/
src/styles/
angular.json

# Look for existing environment/config patterns
# Vertex already uses configuration files for test/prod
# Check for existing feature toggle patterns
```

### Step 2: Begin with TypeScript Models
Define the structure first:

1. Create `src/app/core/models/feature-flags.enum.ts`
   - Define all feature flags as enum values
   - Use descriptive PascalCase names
   - Add comments for complex flags

2. Create `src/app/core/models/app-config.interface.ts`
   - Define AppConfig interface
   - Include tenant, environment, API URLs, feature flags, branding
   - Make featureFlags use the enum as keys

### Step 3: Create Core Services
Now build the services:

1. Create `src/app/core/services/app-config.service.ts`
   - Implement with APP_INITIALIZER integration
   - Use AppConfig interface for type safety
   - Handle loading errors gracefully

2. Create `src/app/core/services/feature-flag.service.ts`
   - Depend on AppConfigService
   - Implement isEnabled, areAllEnabled, isAnyEnabled
   - Use FeatureFlag enum for type safety

3. Update `src/app/app.module.ts` (or app.config.ts if using standalone)
   - Add APP_INITIALIZER for AppConfigService
   - Ensure services are provided

### Step 4: Create Feature Flag Utilities
Build the guard and directive:

1. Create `src/app/core/guards/feature-flag.guard.ts`
   - Use Angular 20 functional guard pattern
   - Use inject() for dependency injection
   - Return UrlTree for redirect

2. Create `src/app/core/directives/feature-flag.directive.ts`
   - Make it standalone
   - Support *appFeatureFlag syntax
   - Support else template

### Step 5: Create Sample Configuration Files
Test the system:

1. Create `src/assets/config/vertex/app-config.devel.json`
2. Create `src/assets/config/vertex-plus/app-config.devel.json`
3. Ensure they conform to AppConfig interface
4. Test that AppConfigService can read them

### Step 6: Set Up Design Tokens
Once core infrastructure works:

1. Create `src/styles/tokens.scss` with base CSS custom properties
2. Create `src/styles/brands/vertex.scss` (copy existing styles)
3. Create `src/styles/brands/vertex-plus.scss` (define HyP3+ overrides)
4. Create placeholder `src/styles/brand.scss`
5. Update main `src/styles.scss` to import tokens and brand

### Step 7: Test Configuration System
Before expanding to build configs:
1. Add a simple way to manually test config loading
2. Verify AppConfigService can read different configs
3. Test FeatureFlagService.isEnabled() with different flags
4. Test feature flag directive in a component
5. Verify brand.scss can be swapped manually
6. Confirm no breaking changes to existing functionality

### Step 8: Expand to Build System
Once core infrastructure works:
1. Add configurations to `angular.json`
2. Set up file replacements
3. Create build scripts in `package.json`
4. Test each build configuration locally

### Code Templates to Start With

The detailed implementation code is provided in:
- **Feature Flag System** (in this document above)
- **AppConfigService implementation** (Section 1 in "Option A: In-Depth" of Multi-Brand Guide)
- **APP_INITIALIZER setup** (Section 1 in "Option A: In-Depth")
- **Design token structure** (Section 2 in "Option A: In-Depth")
- **angular.json configuration format** (Section 4 in "Option A: In-Depth")
- **GitHub Actions workflow** (Section 5 in "Option A: In-Depth")

## Common Pitfalls to Avoid

### 1. Don't Scatter Brand Checks Throughout Code
❌ **Bad:** `if (brand === 'vertex-plus') { ... }` everywhere  
✓ **Good:** Route-level composition, feature guards, service abstraction

### 2. Don't Forget File Replacements
The build system uses `fileReplacements` in angular.json to swap:
- Config files
- Style files  
- Favicons
- Any other tenant-specific assets

Missing a replacement means the wrong file gets bundled.

### 3. Don't Hardcode Tenant Values
❌ **Bad:** Hardcoded API URLs, GA IDs, brand names in code  
✓ **Good:** All tenant-specific values in `app-config.json`, accessed via AppConfigService

### 4. Don't Break Existing Functionality
- Test the app after each phase
- Ensure default Vertex behavior unchanged
- Use feature flags for new Vertex+ features

### 5. Don't Commit the Swapped Files
Add to `.gitignore`:
```
src/assets/app-config.json
src/styles/brand.scss
```
These are build-time replacements, not source files.

### 6. Don't Assume Cookie Domain
Test cookie persistence between subdomains:
- Cookies must be set on `.asf.alaska.edu` (note the leading dot)
- Verify auth works when navigating between tenants

### 7. Don't Forget TypeScript Types
Create proper interfaces for:
- AppConfig structure
- Feature flag definitions
- API response types per tenant (if different)

---

## TypeScript Configuration Best Practices

### Use Strict Types
Enable strict mode in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

### Type-Safe Configuration Access
```typescript
// ✓ GOOD: Typed with fallback
const apiUrl = this.config.get<string>('apiBaseUrl', 'https://default.api.com');

// ✓ GOOD: Using interface
const config: AppConfig = this.config.all;

// ❌ BAD: Using 'any'
const config: any = this.config.all;
```

### Feature Flag Enum Usage
```typescript
// ✓ GOOD: Using enum
if (this.featureFlags.isEnabled(FeatureFlag.SHOW_HYP3_PLUS_BRANDING)) {
  // ...
}

// ❌ BAD: String literals (prone to typos)
if (this.featureFlags.isEnabled('showHyp3PlusBranding')) {
  // ...
}
```

### Configuration File Validation
Consider using a JSON schema validator at build time:
```typescript
// tools/validate-config.ts
import Ajv from 'ajv';
import { AppConfig } from '../src/app/core/models/app-config.interface';

const schema = {
  type: 'object',
  required: ['tenant', 'environment', 'apiBaseUrl', 'featureFlags'],
  properties: {
    tenant: { type: 'string', enum: ['vertex', 'vertex-plus'] },
    environment: { type: 'string', enum: ['devel', 'test', 'prod'] },
    // ... rest of schema
  }
};

// Validate configs during build
```

### Typed Environment Detection
```typescript
// src/app/core/models/environment.type.ts
export type Environment = 'devel' | 'test' | 'prod';
export type Tenant = 'vertex' | 'vertex-plus';

// Use in AppConfig interface
export interface AppConfig {
  tenant: Tenant;
  environment: Environment;
  // ...
}
```

---

## Immediate Next Steps

### For Claude Code to Begin Implementation:

**1. Initial Assessment** (Don't code yet, just explore)
```bash
# Examine current structure
- Review src/app/core/services/ directory
- Check existing angular.json configuration structure
- Look at current styles/ organization
- Review any existing environment configuration patterns
```

**2. Phase 1 Implementation** (Start coding)
Create the foundational pieces:
- `src/app/core/services/app-config.service.ts`
- `src/app/core/services/analytics.service.ts` (optional but recommended)
- Update `src/app/app.module.ts` with APP_INITIALIZER
- Create `src/assets/config/vertex/app-config.devel.json` (sample)
- Create `src/assets/config/vertex-plus/app-config.devel.json` (sample)

**3. Verification Steps**
After Phase 1, verify:
- [ ] AppConfigService loads config at startup
- [ ] Config values are accessible via `get()` method
- [ ] No errors in console
- [ ] Existing functionality still works
- [ ] Can manually test with different config files

**4. Phase 2 Implementation**
Design system foundation:
- Create design token files
- Set up brand override structure
- Test manual brand switching

## Success Criteria

### Milestone 1: Runtime Configuration Working
- ✓ AppConfigService successfully loads config from JSON
- ✓ Can access brand, GA ID, API URLs, feature flags
- ✓ No breaking changes to existing app
- ✓ Ready for build system expansion

### Milestone 2: Design System Established
- ✓ Base design tokens defined
- ✓ Brand overrides for Vertex and Vertex+ created
- ✓ Can manually swap themes
- ✓ Styles compile without errors

### Milestone 3: Build Configurations Complete
- ✓ angular.json has 6 configurations (2 tenants × 3 environments)
- ✓ Can build each configuration successfully
- ✓ Correct config/styles/assets used per build
- ✓ Build outputs are properly branded

### Milestone 4: CI/CD Pipeline Functional
- ✓ GitHub Actions matrix builds all 6 variants
- ✓ Artifacts are created correctly
- ✓ (Future) Deployments to correct S3/CloudFront targets

### Final Goal
Two independently deployable versions of Vertex from one codebase:
- `search.asf.alaska.edu` - Standard Vertex
- `vertex-plus.asf.alaska.edu` - HyP3+ branded version

Each with its own:
- Branding (colors, logos, typography)
- Google Analytics tracking
- API endpoints
- Feature flags
- But sharing the same core codebase for maintainability

---

## Quick-Start Checklist for Claude Code

### Before You Start
- [ ] Read this entire document
- [ ] Review the Multi-Brand Guide document (linked above)
- [ ] Understand the subdomain strategy (separate domains per tenant)
- [ ] Understand Angular 20 features (standalone components, functional guards)
- [ ] Familiarize yourself with existing Vertex codebase structure

### Phase 1: Foundation (Do This First)
- [ ] Create `feature-flags.enum.ts` with all feature flag definitions
- [ ] Create `app-config.interface.ts` with TypeScript types
- [ ] Create `app-config.service.ts` with APP_INITIALIZER
- [ ] Create `feature-flag.service.ts` with type-safe flag checking
- [ ] Create `feature-flag.guard.ts` (functional guard for Angular 20)
- [ ] Create `feature-flag.directive.ts` (standalone directive)
- [ ] Create sample config files for both tenants (devel environment)
- [ ] Update `app.module.ts` or `app.config.ts` with APP_INITIALIZER
- [ ] Test that config loads successfully
- [ ] Test that feature flags can be checked
- [ ] Verify no breaking changes to existing app

### Phase 2: Design System
- [ ] Create `tokens.scss` with CSS custom properties
- [ ] Create brand override files (vertex.scss, vertex-plus.scss)
- [ ] Update `styles.scss` to import new files
- [ ] Test that styles compile
- [ ] Verify design tokens work in components

### Phase 3: Build Configuration
- [ ] Add 6 configurations to angular.json (2 tenants × 3 envs)
- [ ] Set up file replacements for each config
- [ ] Add build scripts to package.json
- [ ] Test each build configuration locally
- [ ] Verify correct config/styles/assets used per build

### Phase 4: Feature Implementation
- [ ] Identify features that differ between tenants
- [ ] Add appropriate feature flags to enum
- [ ] Update config files with flag values per tenant
- [ ] Apply feature flag guards to routes
- [ ] Use feature flag directive in templates
- [ ] Replace hardcoded tenant checks with flag checks
- [ ] Update "On Demand" → "HyP3+" based on flags

### Phase 5: CI/CD
- [ ] Create GitHub Actions workflow with matrix
- [ ] Configure deployment targets (S3/CloudFront)
- [ ] Test matrix build in CI
- [ ] Set up GitHub Secrets for deployments

### Testing Checkpoints
After each phase, verify:
- [ ] No TypeScript compilation errors
- [ ] No console errors when running app
- [ ] Existing Vertex functionality still works
- [ ] Can switch between configurations successfully
- [ ] Feature flags work as expected in templates and routes
- [ ] Type safety is maintained (no 'any' types)

### Definition of Done
- [ ] Two working builds from one codebase
- [ ] Each tenant has correct branding
- [ ] Each tenant has correct configuration
- [ ] Feature flags control tenant-specific features
- [ ] No hardcoded tenant checks (if/else) in code
- [ ] All TypeScript types are properly defined
- [ ] CI/CD pipeline builds all variants
- [ ] Documentation updated
- [ ] Team review completed

---

**Document Created:** 2025-10-27
**For:** Claude Code implementation reference
**Status:** Ready for implementation
