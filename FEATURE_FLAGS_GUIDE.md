# Feature Flags Usage Guide

This guide shows how to use the feature flag system to control tenant-specific functionality in the Vertex multi-tenant application.

## Table of Contents
- [Overview](#overview)
- [Available Feature Flags](#available-feature-flags)
- [Usage Patterns](#usage-patterns)
- [Examples](#examples)
- [Best Practices](#best-practices)

---

## Overview

The feature flag system allows different functionality between Vertex and Vertex+ deployments from a single codebase. Feature flags are:

- **Type-safe** via TypeScript enums
- **Centralized** in tenant configuration files
- **Runtime-evaluated** based on build configuration
- **Easy to test** with different configurations

### How It Works

1. Feature flags are defined in `src/app/models/feature-flags.enum.ts`
2. Flag values are set per tenant in `src/app/services/envs/env-vertex.ts` and `env-vertex-plus.ts`
3. Flags are checked at runtime via `FeatureFlagService`
4. UI components conditionally render based on flags
5. Routes are protected by feature flag guards

---

## Available Feature Flags

### HyP3+ / Vertex+ Features

| Flag | Vertex | Vertex+ | Description |
|------|--------|---------|-------------|
| `SHOW_HYP3_PLUS_BRANDING` | ❌ | ✅ | Show "Vertex+" branding and HyP3+ terminology |
| `ENABLE_ENTERPRISE_API` | ❌ | ✅ | Use enterprise HyP3 API endpoints |
| `SHOW_ADVANCED_PROCESSING` | ❌ | ✅ | Show advanced processing features |

### Search Features

| Flag | Vertex | Vertex+ | Description |
|------|--------|---------|-------------|
| `ENABLE_EVENT_SEARCH` | ✅ | ✅ | Enable SARViews event search |
| `ENABLE_DISPLACEMENT_SEARCH` | ✅ | ✅ | Enable displacement search |
| `ENABLE_SBAS_SEARCH` | ✅ | ✅ | Enable SBAS search |
| `ENABLE_BASELINE_SEARCH` | ✅ | ✅ | Enable baseline search |
| `ENABLE_TIMESERIES_SEARCH` | ✅ | ✅ | Enable timeseries search |
| `ENABLE_DERIVED_DATASETS` | ✅ | ✅ | Enable derived datasets |

### UI Features

| Flag | Vertex | Vertex+ | Description |
|------|--------|---------|-------------|
| `SHOW_BETA_BANNER` | ❌ | ✅ | Show beta/preview banner |
| `ENABLE_NEW_MAP_TOOLS` | ✅ | ✅ | Enable new map drawing tools |
| `SHOW_EXPORT_OPTIONS` | ✅ | ✅ | Show export functionality |
| `SHOW_DOWNLOAD_QUEUE` | ✅ | ✅ | Show download queue |

### API Features

| Flag | Vertex | Vertex+ | Description |
|------|--------|---------|-------------|
| `USE_DAAC_HYP3` | ✅ | ❌ | Use DAAC HyP3 endpoints vs enterprise |
| `ENABLE_BULK_DOWNLOAD` | ✅ | ✅ | Enable bulk download features |
| `ENABLE_CMR_SEARCH` | ✅ | ✅ | Enable CMR search integration |

---

## Usage Patterns

### 1. In Component TypeScript

```typescript
import { Component } from '@angular/core';
import { FeatureFlagService } from '@services';
import { FeatureFlag } from '@models';

@Component({
  selector: 'app-my-component',
  template: '...'
})
export class MyComponent {
  constructor(private featureFlags: FeatureFlagService) {}

  ngOnInit() {
    // Check single flag
    if (this.featureFlags.isEnabled(FeatureFlag.SHOW_HYP3_PLUS_BRANDING)) {
      console.log('Vertex+ branding enabled');
    }

    // Check multiple flags (ALL must be enabled)
    if (this.featureFlags.areAllEnabled(
      FeatureFlag.ENABLE_ENTERPRISE_API,
      FeatureFlag.SHOW_ADVANCED_PROCESSING
    )) {
      this.initAdvancedFeatures();
    }

    // Check multiple flags (ANY can be enabled)
    if (this.featureFlags.isAnyEnabled(
      FeatureFlag.ENABLE_EVENT_SEARCH,
      FeatureFlag.ENABLE_DISPLACEMENT_SEARCH
    )) {
      this.showSearchOptions();
    }
  }
}
```

### 2. In Component Templates

```typescript
import { Component } from '@angular/core';
import { FeatureFlag } from '@models';

@Component({
  selector: 'app-my-component',
  template: `
    <!-- Simple conditional rendering -->
    <div *appFeatureFlag="FeatureFlag.SHOW_HYP3_PLUS_BRANDING">
      <h1>Welcome to Vertex+</h1>
    </div>

    <!-- With else template -->
    <ng-container *appFeatureFlag="FeatureFlag.SHOW_ADVANCED_PROCESSING; else basicView">
      <app-advanced-processing></app-advanced-processing>
    </ng-container>
    <ng-template #basicView>
      <app-basic-processing></app-basic-processing>
    </ng-template>

    <!-- Beta banner (Vertex+ only) -->
    <div *appFeatureFlag="FeatureFlag.SHOW_BETA_BANNER" class="beta-banner">
      <span class="plus-badge">Beta</span>
      You're using Vertex+ preview features
    </div>
  `
})
export class MyComponent {
  // Make FeatureFlag enum available in template
  FeatureFlag = FeatureFlag;
}
```

### 3. In Route Guards

```typescript
// app-routing.module.ts
import { Routes } from '@angular/router';
import { featureFlagGuard, requireAllFlags } from '@guards/feature-flag.guard';
import { FeatureFlag } from '@models';

const routes: Routes = [
  // Single flag requirement
  {
    path: 'advanced-processing',
    loadComponent: () => import('./advanced-processing/advanced-processing.component'),
    canActivate: [featureFlagGuard(FeatureFlag.SHOW_ADVANCED_PROCESSING)]
  },

  // Multiple flags required (ALL)
  {
    path: 'enterprise',
    loadComponent: () => import('./enterprise/enterprise.component'),
    canActivate: [requireAllFlags(
      FeatureFlag.ENABLE_ENTERPRISE_API,
      FeatureFlag.SHOW_ADVANCED_PROCESSING
    )]
  },

  // Redirect to custom path if disabled
  {
    path: 'beta-feature',
    component: BetaFeatureComponent,
    canActivate: [featureFlagGuard(FeatureFlag.SHOW_BETA_BANNER, '/home')]
  }
];
```

### 4. Conditional Service Logic

```typescript
import { Injectable } from '@angular/core';
import { FeatureFlagService, EnvironmentService } from '@services';
import { FeatureFlag } from '@models';

@Injectable({ providedIn: 'root' })
export class Hyp3Service {
  constructor(
    private featureFlags: FeatureFlagService,
    private env: EnvironmentService
  ) {}

  getApiUrl(): string {
    if (this.featureFlags.isEnabled(FeatureFlag.USE_DAAC_HYP3)) {
      return 'https://hyp3-api.asf.alaska.edu';
    } else {
      return 'https://hyp3-api-enterprise.asf.alaska.edu';
    }
  }

  submitJob(params: any) {
    const url = this.getApiUrl();

    // Add enterprise-specific parameters
    if (this.featureFlags.isEnabled(FeatureFlag.ENABLE_ENTERPRISE_API)) {
      params.priority = 'high';
      params.enterprise = true;
    }

    return this.http.post(url + '/jobs', params);
  }
}
```

### 5. Dynamic Branding

```typescript
import { Component } from '@angular/core';
import { EnvironmentService } from '@services';
import { FeatureFlag } from '@models';

@Component({
  selector: 'app-header',
  template: `
    <header>
      <h1>{{ appName }}</h1>
      <span *ngIf="isVertexPlus" class="plus-badge">Plus</span>
    </header>
  `
})
export class HeaderComponent {
  appName: string;
  isVertexPlus: boolean;

  constructor(private env: EnvironmentService) {
    this.appName = env.branding.appName; // "Vertex" or "Vertex+"
    this.isVertexPlus = env.isVertexPlus;
  }
}
```

---

## Examples

### Example 1: Conditionally Show Menu Item

```typescript
@Component({
  selector: 'app-main-menu',
  template: `
    <mat-menu #menu="matMenu">
      <button mat-menu-item>Geographic Search</button>
      <button mat-menu-item>List Search</button>

      <!-- Only show in Vertex+ -->
      <button mat-menu-item
        *appFeatureFlag="FeatureFlag.SHOW_ADVANCED_PROCESSING">
        Advanced Processing
      </button>
    </mat-menu>
  `
})
export class MainMenuComponent {
  FeatureFlag = FeatureFlag;
}
```

### Example 2: Rename "On Demand" to "HyP3+"

```typescript
@Component({
  selector: 'app-processing-type',
  template: `
    <h2>
      <ng-container *appFeatureFlag="FeatureFlag.SHOW_HYP3_PLUS_BRANDING; else onDemand">
        HyP3+ Processing
      </ng-container>
      <ng-template #onDemand>
        On Demand Processing
      </ng-template>
    </h2>
  `
})
export class ProcessingTypeComponent {
  FeatureFlag = FeatureFlag;
}
```

### Example 3: API Endpoint Selection

```typescript
@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl: string;

  constructor(
    private featureFlags: FeatureFlagService,
    private env: EnvironmentService
  ) {
    this.baseUrl = this.determineApiUrl();
  }

  private determineApiUrl(): string {
    if (this.featureFlags.isEnabled(FeatureFlag.ENABLE_ENTERPRISE_API)) {
      return this.env.currentEnv.api + '/enterprise';
    }
    return this.env.currentEnv.api;
  }

  search(params: any) {
    return this.http.get(this.baseUrl + '/search', { params });
  }
}
```

### Example 4: Protected Route with Fallback

```typescript
const routes: Routes = [
  {
    path: 'advanced',
    component: AdvancedComponent,
    canActivate: [featureFlagGuard(FeatureFlag.SHOW_ADVANCED_PROCESSING, '/basic')]
  },
  {
    path: 'basic',
    component: BasicComponent
  }
];
```

---

## Best Practices

### ✅ DO

1. **Use the enum for type safety**
   ```typescript
   // Good
   featureFlags.isEnabled(FeatureFlag.SHOW_HYP3_PLUS_BRANDING)

   // Bad - typo prone!
   featureFlags.isEnabled('showHyp3PlusBranding')
   ```

2. **Keep flag names descriptive**
   ```typescript
   // Good
   SHOW_ADVANCED_PROCESSING
   ENABLE_ENTERPRISE_API

   // Bad
   NEW_FEATURE
   BETA_MODE
   ```

3. **Document flag purpose**
   ```typescript
   // In feature-flags.enum.ts
   /** Enable enterprise HyP3 API endpoints for Vertex+ */
   ENABLE_ENTERPRISE_API = 'enableEnterpriseApi',
   ```

4. **Use guards for route protection**
   ```typescript
   // Good - prevents access if flag disabled
   canActivate: [featureFlagGuard(FeatureFlag.SHOW_ADVANCED_PROCESSING)]

   // Bad - still loads component
   ngOnInit() {
     if (!this.featureFlags.isEnabled(...)) {
       this.router.navigate(['/']);
     }
   }
   ```

5. **Make enum available in templates**
   ```typescript
   export class MyComponent {
     FeatureFlag = FeatureFlag; // Accessible in template
   }
   ```

### ❌ DON'T

1. **Don't hardcode tenant checks**
   ```typescript
   // Bad
   if (this.env.currentTenant === 'vertex-plus') { ... }

   // Good
   if (this.featureFlags.isEnabled(FeatureFlag.SHOW_HYP3_PLUS_BRANDING)) { ... }
   ```

2. **Don't scatter flag checks everywhere**
   ```typescript
   // Bad - repeated checks
   component1: if (flag) { ... }
   component2: if (flag) { ... }
   component3: if (flag) { ... }

   // Good - route-level protection
   routes: canActivate: [featureFlagGuard(flag)]
   ```

3. **Don't mix flag logic with business logic**
   ```typescript
   // Bad
   processData() {
     if (this.featureFlags.isEnabled(FeatureFlag.X)) {
       // complex logic mixed with flag check
     }
   }

   // Good
   processData() {
     const processor = this.featureFlags.isEnabled(FeatureFlag.X)
       ? this.advancedProcessor
       : this.basicProcessor;
     return processor.process();
   }
   ```

4. **Don't use flags for A/B testing**
   Feature flags are for tenant-specific features, not experimentation.

---

## Testing with Different Configurations

### Build and Serve Vertex

```bash
npm run serve:test:vertex
# Opens with Vertex configuration
# SHOW_HYP3_PLUS_BRANDING = false
```

### Build and Serve Vertex+

```bash
npm run serve:test:vertex-plus
# Opens with Vertex+ configuration
# SHOW_HYP3_PLUS_BRANDING = true
```

### Verify Flags in Console

```javascript
// In browser console after app loads
ng.probe($0).injector.get('FeatureFlagService').getAllFlags()
// Returns all feature flags and their values
```

---

## Adding New Feature Flags

1. **Add to enum** (`src/app/models/feature-flags.enum.ts`):
   ```typescript
   export enum FeatureFlag {
     // ...existing flags
     MY_NEW_FEATURE = 'myNewFeature',
   }
   ```

2. **Set values per tenant** (`src/app/services/envs/env-*.ts`):
   ```typescript
   featureFlags: {
     // ...existing flags
     [FeatureFlag.MY_NEW_FEATURE]: true, // or false
   }
   ```

3. **Use in code**:
   ```typescript
   if (this.featureFlags.isEnabled(FeatureFlag.MY_NEW_FEATURE)) {
     // your feature code
   }
   ```

---

## Support

For questions or issues with feature flags:
1. Check this guide first
2. Review `vertex-multi-brand-project-brief.md`
3. Examine existing usage in the codebase
4. Test with both `vertex` and `vertex-plus` configurations

---

**Last Updated:** 2025-10-27 9:14 PST
**Multi-Tenant Implementation:** Phase 4
