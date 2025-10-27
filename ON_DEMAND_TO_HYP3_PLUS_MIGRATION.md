# On Demand → HyP3+ Migration Guide

This document outlines the changes needed to rename "On Demand" to "HyP3+" based on the `SHOW_HYP3_PLUS_BRANDING` feature flag.

## Overview

The term "On Demand" should be conditionally renamed to "HyP3+" when the Vertex+ branding is enabled. This affects:
- UI labels and text
- Translation files (English and Spanish)
- Component templates
- Store action descriptions
- Service notifications

## Files Requiring Updates

### 1. Translation Files (i18n)

**Files:**
- `src/assets/i18n/en.json`
- `src/assets/i18n/es.json`

**Strategy:** Add new keys for HyP3+ terminology, use feature flag to select appropriate key

**Example:**
```json
{
  "ON_DEMAND_PROCESSING": "On Demand Processing",
  "HYP3_PLUS_PROCESSING": "HyP3+ Processing",
  "PROCESSING_LABEL": "On Demand",  // Keep existing
  "HYP3_PLUS_LABEL": "HyP3+"        // Add new
}
```

**Usage in Templates:**
```html
<!-- Before -->
<h2>{{ 'ON_DEMAND_PROCESSING' | translate }}</h2>

<!-- After -->
<h2>
  <ng-container *appFeatureFlag="FeatureFlag.SHOW_HYP3_PLUS_BRANDING; else onDemand">
    {{ 'HYP3_PLUS_PROCESSING' | translate }}
  </ng-container>
  <ng-template #onDemand>
    {{ 'ON_DEMAND_PROCESSING' | translate }}
  </ng-template>
</h2>
```

### 2. Dataset Selector Component

**File:** `src/app/components/shared/selectors/dataset-selector/dataset-selector.component.html`

**Change:** Menu item label for On Demand processing

**Current:**
```html
<button mat-menu-item>
  On Demand
</button>
```

**Recommended:**
```html
<button mat-menu-item>
  <ng-container *appFeatureFlag="FeatureFlag.SHOW_HYP3_PLUS_BRANDING; else onDemand">
    HyP3+
  </ng-container>
  <ng-template #onDemand>On Demand</ng-template>
</button>
```

### 3. Queue Component

**File:** `src/app/components/header/queue/queue.component.ts`

**Change:** Queue title/label references

**Strategy:** Use EnvironmentService to get branding dynamically

**Example:**
```typescript
constructor(
  private env: EnvironmentService,
  private featureFlags: FeatureFlagService
) {}

get queueTitle(): string {
  return this.featureFlags.isEnabled(FeatureFlag.SHOW_HYP3_PLUS_BRANDING)
    ? 'HyP3+ Processing Queue'
    : 'On Demand Processing Queue';
}
```

### 4. Processing Queue Components

**Files:**
- `src/app/components/header/processing-queue/processing-signup/processing-signup.component.ts`
- `src/app/components/header/processing-queue/processing-signup/processing-signup.component.html`
- `src/app/components/header/processing-queue/processing-queue.component.html`

**Change:** All "On Demand" text references

**Example Pattern:**
```html
<!-- Template -->
<h2>
  {{ processingTitle }}
  <span *appFeatureFlag="FeatureFlag.SHOW_HYP3_PLUS_BRANDING" class="plus-badge">+</span>
</h2>

<p>{{ processingDescription }}</p>
```

```typescript
// Component
get processingTitle(): string {
  return this.featureFlags.isEnabled(FeatureFlag.SHOW_HYP3_PLUS_BRANDING)
    ? 'HyP3+ Processing'
    : 'On Demand Processing';
}

get processingDescription(): string {
  return this.featureFlags.isEnabled(FeatureFlag.SHOW_HYP3_PLUS_BRANDING)
    ? 'Submit jobs to HyP3+ for advanced on-demand processing'
    : 'Submit jobs to HyP3 for on-demand processing';
}
```

### 5. Dataset Header Component

**File:** `src/app/components/header/dataset-header/dataset-header.component.html`

**Change:** Header title for On Demand search type

**Recommended:**
```html
<ng-container *ngIf="searchType === SearchType.CUSTOM_PRODUCTS">
  <ng-container *appFeatureFlag="FeatureFlag.SHOW_HYP3_PLUS_BRANDING; else onDemandHeader">
    <h1>HyP3+ Processing</h1>
  </ng-container>
  <ng-template #onDemandHeader>
    <h1>On Demand Processing</h1>
  </ng-template>
</ng-container>
```

### 6. Scene File Component

**File:** `src/app/components/results-menu/scene-files/scene-file/scene-file.component.html`

**Change:** File type labels

**Recommended:** Add conditional labeling for on-demand product types

### 7. Store Actions (Descriptive Text)

**Files:**
- `src/app/store/ui/ui.action.ts`
- `src/app/store/search/search.action.ts`
- `src/app/store/scenes/scenes.action.ts`
- `src/app/store/queue/queue.action.ts`
- `src/app/store/hyp3/hyp3.action.ts`

**Change:** Action type names (for debugging/logging)

**Note:** These are enum values and can't be changed at runtime. Keep as "On Demand" for backward compatibility, or add new enum values for HyP3+.

**Example:**
```typescript
export enum UIActionType {
  // Keep existing
  SET_IS_ON_DEMAND_QUEUE_OPEN = '[UI] Set Is On Demand Queue Open',

  // Could add new if needed
  SET_IS_HYP3_PLUS_QUEUE_OPEN = '[UI] Set Is HyP3+ Queue Open',
}
```

### 8. Notification Service

**File:** `src/app/services/notification.service.ts`

**Change:** Notification messages mentioning "On Demand"

**Strategy:** Create dynamic message methods

**Example:**
```typescript
notifyProcessingSubmitted(jobCount: number): void {
  const processingName = this.featureFlags.isEnabled(FeatureFlag.SHOW_HYP3_PLUS_BRANDING)
    ? 'HyP3+'
    : 'On Demand';

  this.success(
    `${jobCount} ${processingName} job${jobCount > 1 ? 's' : ''} submitted successfully`
  );
}
```

### 9. Search Type Model

**File:** `src/app/models/search-type.model.ts`

**Change:** Search type display names

**Current:**
```typescript
export enum SearchType {
  CUSTOM_PRODUCTS = 'CUSTOM_PRODUCTS',
  // ...
}
```

**Note:** Enum values should remain unchanged. Add a helper function for display names:

```typescript
// In a new file: src/app/models/search-type-display.ts
import { FeatureFlagService } from '@services';
import { FeatureFlag, SearchType } from '@models';

export function getSearchTypeDisplayName(
  searchType: SearchType,
  featureFlags: FeatureFlagService
): string {
  if (searchType === SearchType.CUSTOM_PRODUCTS) {
    return featureFlags.isEnabled(FeatureFlag.SHOW_HYP3_PLUS_BRANDING)
      ? 'HyP3+'
      : 'On Demand';
  }
  // ... other search types
}
```

---

## Implementation Priority

### Phase 1: High Visibility (Do First)
1. ✅ Main navigation menu items
2. ✅ Page titles and headers
3. ✅ Queue dialog titles
4. ✅ Primary action buttons

### Phase 2: User-Facing Text (Do Second)
1. Help text and descriptions
2. Notification messages
3. Form labels
4. Tooltips

### Phase 3: Internal References (Do Later)
1. Store action names (logging only)
2. Console messages
3. Developer-facing text

---

## Template Pattern Library

### Pattern 1: Simple Text Replacement
```html
<span *appFeatureFlag="FeatureFlag.SHOW_HYP3_PLUS_BRANDING; else onDemand">
  HyP3+
</span>
<ng-template #onDemand>On Demand</ng-template>
```

### Pattern 2: Component Property
```typescript
// Component
export class MyComponent {
  processingLabel$ = this.featureFlags.isEnabled(FeatureFlag.SHOW_HYP3_PLUS_BRANDING)
    ? 'HyP3+'
    : 'On Demand';
}
```

```html
<!-- Template -->
<h2>{{ processingLabel }}</h2>
```

### Pattern 3: Translation Key Selection
```typescript
// Component
get processingKey(): string {
  return this.featureFlags.isEnabled(FeatureFlag.SHOW_HYP3_PLUS_BRANDING)
    ? 'HYP3_PLUS_PROCESSING'
    : 'ON_DEMAND_PROCESSING';
}
```

```html
<!-- Template -->
<h2>{{ processingKey | translate }}</h2>
```

### Pattern 4: CSS Class-Based
```html
<div class="processing-header" [class.hyp3-plus]="isHyp3Plus">
  <h2>Processing</h2>
  <span class="badge">{{ badgeText }}</span>
</div>
```

```scss
.processing-header {
  .badge::before {
    content: 'On Demand';
  }

  &.hyp3-plus .badge::before {
    content: 'HyP3+';
  }
}
```

---

## Testing Checklist

After making changes, verify with both configurations:

### Vertex Configuration
```bash
npm run serve:test:vertex
```
- [ ] All text shows "On Demand"
- [ ] No "HyP3+" or "Plus" badges visible
- [ ] Queue titles use "On Demand"
- [ ] Menu items say "On Demand"

### Vertex+ Configuration
```bash
npm run serve:test:vertex-plus
```
- [ ] All text shows "HyP3+"
- [ ] Plus badges visible where appropriate
- [ ] Queue titles use "HyP3+"
- [ ] Menu items say "HyP3+"

---

## Bulk Search & Replace (NOT RECOMMENDED)

While you could search and replace all instances, this is NOT recommended because:
1. Some "On Demand" references should remain (e.g., enum values, API keys)
2. Context matters - not all references are user-facing
3. Hard-coded replacements don't allow runtime switching

Instead, use feature flags for conditional rendering.

---

## Example Implementation

Here's a complete example for the Processing Queue dialog:

```typescript
// processing-queue.component.ts
import { Component } from '@angular/core';
import { FeatureFlagService } from '@services';
import { FeatureFlag } from '@models';

@Component({
  selector: 'app-processing-queue',
  templateUrl: './processing-queue.component.html'
})
export class ProcessingQueueComponent {
  FeatureFlag = FeatureFlag;

  constructor(private featureFlags: FeatureFlagService) {}

  get queueTitle(): string {
    return this.featureFlags.isEnabled(FeatureFlag.SHOW_HYP3_PLUS_BRANDING)
      ? 'HyP3+ Processing Queue'
      : 'On Demand Processing Queue';
  }

  get emptyMessage(): string {
    return this.featureFlags.isEnabled(FeatureFlag.SHOW_HYP3_PLUS_BRANDING)
      ? 'No HyP3+ jobs in queue'
      : 'No on-demand jobs in queue';
  }
}
```

```html
<!-- processing-queue.component.html -->
<h1>
  {{ queueTitle }}
  <span *appFeatureFlag="FeatureFlag.SHOW_HYP3_PLUS_BRANDING" class="plus-badge">+</span>
</h1>

<div *ngIf="jobs.length === 0" class="empty-state">
  {{ emptyMessage }}
</div>

<mat-list>
  <mat-list-item *ngFor="let job of jobs">
    <span class="job-type">
      <ng-container *appFeatureFlag="FeatureFlag.SHOW_HYP3_PLUS_BRANDING; else onDemandJob">
        HyP3+ {{ job.jobType }}
      </ng-container>
      <ng-template #onDemandJob>
        On Demand {{ job.jobType }}
      </ng-template>
    </span>
  </mat-list-item>
</mat-list>
```

---

## Migration Status

Track your progress updating each file:

- [ ] `dataset-selector.component.html`
- [ ] `queue.component.ts`
- [ ] `processing-signup.component.ts`
- [ ] `processing-signup.component.html`
- [ ] `processing-queue.component.html`
- [ ] `dataset-header.component.html`
- [ ] `scene-file.component.html`
- [ ] `notification.service.ts`
- [ ] `en.json` (add new keys)
- [ ] `es.json` (add new keys)

---

**Last Updated:** 2025-10-27
**Status:** Ready for implementation
**Estimated Effort:** 4-6 hours (depending on scope)
