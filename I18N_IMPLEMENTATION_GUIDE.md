# I18N Implementation Guide - Missing Translation Keys

This document provides a complete guide for implementing the missing translation keys found in the Discovery SearchUI application.

## Summary

**Total Missing Translation Keys: 58**
- Dialog Buttons: 2
- Map & Visualization: 6
- Accessibility Labels: 4
- Tooltips: 7
- Form Placeholders: 7
- Notification Messages: 22
- Scene/Product Labels: 1
- Help Pages: 1
- Actions: 3
- Dynamic Templates: 5

---

## Step 1: Add Keys to Translation Files

### Files to Update:
1. `src/assets/i18n/en.json` - English (source language)
2. `src/assets/i18n/es.json` - Spanish
3. `src/assets/i18n/de.json` - German

### Instructions:
1. Open `TRANSLATION_KEYS_TO_ADD.json`
2. Copy all entries (excluding _COMMENT lines)
3. Add them to `en.json` in alphabetical order
4. Use BabelEdit to translate to Spanish and German, OR manually add translations

---

## Step 2: Update HTML Templates

### Critical Files Requiring Updates:

#### 1. Dialog Buttons
**File:** `src/app/components/results-menu/timeseries-results-menu/confirmation-dialog.html`

**Before:**
```html
<button mat-button mat-dialog-close tabindex="-1">Cancel</button>
<button mat-button (click)="onYesClick()" tabindex="1">Delete</button>
```

**After:**
```html
<button mat-button mat-dialog-close tabindex="-1">{{ 'CANCEL' | translate }}</button>
<button mat-button (click)="onYesClick()" tabindex="1">{{ 'DELETE' | translate }}</button>
```

---

**File:** `src/app/components/result-menu/scene-detail/image-dialog/image-dialog.component.html`

**Before:**
```html
<button mat-flat-button (click)="closeDialog()">Close</button>
```

**After:**
```html
<button mat-flat-button (click)="closeDialog()">{{ 'CLOSE_DIALOG' | translate }}</button>
```

---

#### 2. Map Labels
**File:** `src/app/components/map/map.component.html`

**Before:**
```html
<span>Build SBAS SLC Stack</span>
```

**After:**
```html
<span>{{ 'BUILD_SBAS_SLC_STACK' | translate }}</span>
```

---

#### 3. Accessibility Attributes
**File:** `src/app/components/sidebar/saved-searches/saved-searches.component.html`

**Before:**
```html
<element aria-label="Saved Search Type">
```

**After:**
```html
<element [attr.aria-label]="'SAVED_SEARCH_TYPE' | translate">
```

---

**File:** `src/app/components/map/map-controls/view-selector/view-selector.component.html`

**Before:**
```html
<button aria-label="Arctic map projection">
<button aria-label="Equatorial map projection">
<button aria-label="Antarctic map projection">
```

**After:**
```html
<button [attr.aria-label]="'ARCTIC_MAP_PROJECTION' | translate">
<button [attr.aria-label]="'EQUATORIAL_MAP_PROJECTION' | translate">
<button [attr.aria-label]="'ANTARCTIC_MAP_PROJECTION' | translate">
```

---

#### 4. Tooltips (matTooltip)
**File:** `src/app/components/results-menu/scene-files/scene-file/scene-file.component.html`

**Before:**
```html
<button matTooltip="Close contents">
```

**After:**
```html
<button [matTooltip]="'CLOSE_CONTENTS' | translate">
```

---

**File:** `src/app/components/results-menu/scenes-list-header/scenes-list-header.component.html`

**Before:**
```html
<button matTooltip="Copy ids/urls">
```

**After:**
```html
<button [matTooltip]="'COPY_IDS_URLS' | translate">
```

---

**File:** `src/app/components/shared/selectors/mission-selector/mission-selector.component.html`

**Before:**
```html
<button matTooltip="Clear selected mission">
```

**After:**
```html
<button [matTooltip]="'CLEAR_SELECTED_MISSION' | translate">
```

---

**File:** `src/app/components/shared/selectors/dataset-selector/dataset-selector.component.html`

**Before:**
```html
<icon matTooltip="Available for On Demand Processing (HyP3)">
```

**After:**
```html
<icon [matTooltip]="'AVAILABLE_FOR_ON_DEMAND_PROCESSING' | translate">
```

---

**File:** `src/app/components/shared/selectors/job-product-name-selector/job-product-name-selector.component.html`

**Before:**
```html
<button matTooltip="Clear Product Name Filter">
```

**After:**
```html
<button [matTooltip]="'CLEAR_PRODUCT_NAME_FILTER' | translate">
```

**Note:** CLEAR_PRODUCT_NAME_FILTER already exists in en.json, so just fix the binding.

---

**File:** `src/app/components/shared/aoi-options/sarviews-event-search-selector/sarviews-event-search-selector.component.html`

**Before:**
```html
<input matTooltip="event description, id, or type">
```

**After:**
```html
<input [matTooltip]="'EVENT_SEARCH_HELP_TEXT' | translate">
```

---

#### 5. Placeholders
**File:** `src/app/components/shared/selectors/other-selector/other-selector.component.html`

**Before:**
```html
<input placeholder="Group ID">
```

**After:**
```html
<input [placeholder]="'GROUP_ID' | translate">
```

---

**File:** `src/app/components/shared/selectors/job-product-name-selector/job-product-name-selector.component.html`

**Before:**
```html
<input placeholder="S1A...">
```

**After:**
```html
<input [placeholder]="'PRODUCT_NAME_PLACEHOLDER' | translate">
```

---

**File:** `src/app/components/shared/selectors/mission-selector/mission-selector.component.html`

**Before:**
```html
<input placeholder="Filter Campaign">
```

**After:**
```html
<input [placeholder]="'FILTER_CAMPAIGN' | translate">
```

---

**File:** `src/app/components/header/processing-queue/processing-signup/processing-signup.component.html`

**Before:**
```html
<input placeholder="Ex. I am a...">
```

**After:**
```html
<input [placeholder]="'SIGNUP_FIELD_PLACEHOLDER' | translate">
```

---

**File:** `src/app/components/results-menu/sbas-results-menu/sbas-sliders-two/sbas-sliders-two.component.html`

**Before:**
```html
<input placeholder="Meters">
<input placeholder="daysRange.start">
<input placeholder="daysRange.end">
```

**After:**
```html
<input [placeholder]="'METERS' | translate">
<input [placeholder]="'DAYS_RANGE_START' | translate">
<input [placeholder]="'DAYS_RANGE_END' | translate">
```

---

#### 6. Help Page Titles
**File:** `src/app/components/help/help-pages/help-login/help-login.component.html`

**Before:**
```html
<h1>Getting an EarthData ID and Logging In</h1>
```

**After:**
```html
<h1>{{ 'GETTING_EARTHDATA_ID_AND_LOGGING_IN' | translate }}</h1>
```

---

#### 7. Other Text Content
**File:** `src/app/components/result-menu/scene-detail/image-dialog/image-dialog.component.html`

**Before:**
```html
<span *ngIf="product.bytes === 0">Virtual</span>
```

**After:**
```html
<span *ngIf="product.bytes === 0">{{ 'VIRTUAL_PRODUCT' | translate }}</span>
```

---

**File:** `src/app/components/map/attributions/attributions.component.html`

**Before:**
```html
<strong>Improve this map</strong>
```

**After:**
```html
<strong>{{ 'IMPROVE_THIS_MAP' | translate }}</strong>
```

---

**File:** `src/app/components/shared/search-button/search-button.component.html`

**Before:**
```html
<a title="Send email">
```

**After:**
```html
<a [title]="'SEND_EMAIL' | translate">
```

---

**File:** `src/app/components/sidebar/saved-searches/saved-search/saved-search.component.html`

**Before:**
```html
<button [matTooltip]="'Update Saved Search With Current Filters'">
```

**After:**
```html
<button [matTooltip]="'UPDATE_SAVED_SEARCH_WITH_CURRENT_FILTERS' | translate">
```

---

## Step 3: Update TypeScript Files

### Files Requiring TranslateService Injection

For all the files below, ensure TranslateService is injected in the constructor:

```typescript
import { TranslateService } from '@ngx-translate/core';

constructor(
  private translateService: TranslateService,
  // ... other services
) {}
```

---

#### 1. Notification Service
**File:** `src/app/services/notification.service.ts`

This is the most critical file with ~20 hard-coded messages. Here are the key updates:

**Before:**
```typescript
this.info('All jobs submitted were duplicates', 'Error');
```

**After:**
```typescript
this.info(
  this.translateService.instant('ALL_JOBS_DUPLICATES'),
  this.translateService.instant('ERROR')
);
```

**Before:**
```typescript
const message = \`\${count} \${job_type === '' ? '' : job_type + ' '}jobs \${action} the On Demand Queue.\`;
this.info(message, title);
```

**After:**
```typescript
const message = job_type === ''
  ? this.translateService.instant('JOBS_ACTION_ON_DEMAND', { count, action })
  : this.translateService.instant('JOBS_WITH_TYPE_ACTION_ON_DEMAND', { count, jobType: job_type, action });
this.info(message, title);
```

**Before:**
```typescript
this.info('Search Link Copied');
```

**After:**
```typescript
this.info(this.translateService.instant('SEARCH_LINK_COPIED'));
```

**Before:**
```typescript
this.info('API URL Copied');
```

**After:**
```typescript
this.info(this.translateService.instant('API_URL_COPIED'));
```

**Before:**
```typescript
this.info(\`\${lineCount} \${contentType}\${s} Copied\`, 'Clipboard Updated');
```

**After:**
```typescript
this.info(
  this.translateService.instant('LINES_COPIED_TO_CLIPBOARD', { lineCount, contentType }),
  this.translateService.instant('CLIPBOARD_UPDATED')
);
```

**Complete list of replacements in notification.service.ts:**

| Line | Old String | New Translation Key |
|------|------------|---------------------|
| 38 | `'All jobs submitted were duplicates'` | `'ALL_JOBS_DUPLICATES'` |
| 40 | `'Job submitted was a duplicate'` | `'JOB_DUPLICATE'` |
| 45 | `'Jobs ${action} queue'` | `'JOBS_ACTION_QUEUE_TITLE'` (with interpolation) |
| 55 | `'Job ${action} queue'` | `'JOB_ACTION_QUEUE_TITLE'` (with interpolation) |
| 60 | `'Click here to open registration form'` | `'CLICK_TO_OPEN_REGISTRATION_FORM'` |
| 61 | `'Not registered with On Demand service'` | `'NOT_REGISTERED_ON_DEMAND'` |
| 78 | `'Scenes Added'` | `'SCENES_ADDED'` |
| 88 | `'Search Link Copied'` | `'SEARCH_LINK_COPIED'` |
| 92 | `'API URL Copied'` | `'API_URL_COPIED'` |
| 99 | `'Clipboard Updated'` | `'CLIPBOARD_UPDATED'` |
| 142 | `'Filters dismissed and not applied'` | `'FILTERS_DISMISSED_NOT_APPLIED'` |
| 146 | `'Hiding Raw Results'` | `'HIDING_RAW_RESULTS'` |
| 147 | `'Click to show raw results'` | `'CLICK_TO_SHOW_RAW_RESULTS'` |
| 156 | `'${fileExtension} List Import Failed'` | `'LIST_IMPORT_FAILED'` (with interpolation) |
| 157 | `'Click to open documentation on accepted file formatting'` | `'CLICK_TO_OPEN_FILE_FORMAT_DOCS'` |

---

#### 2. Component Files

**File:** `src/app/components/header/dataset-header/aoi-filter/aoi-filter.component.ts`

**Before:**
```typescript
this.notificationService.info('Copied to clipboard');
```

**After:**
```typescript
this.notificationService.info(this.translateService.instant('COPIED_TO_CLIPBOARD'));
```

---

**File:** `src/app/components/header/processing-queue/processing-signup/processing-signup.component.ts`

**Before:**
```typescript
this.notificationService.info('Submitted Form');
```

**After:**
```typescript
this.notificationService.info(this.translateService.instant('SUBMITTED_FORM'));
```

---

**File:** `src/app/components/filters-dropdown/custom-products-filters/job-id-selector/job-id-selector.component.ts`

**Before:**
```typescript
this.notification.info('Invalid Job Ids');
```

**After:**
```typescript
this.notification.info(this.translateService.instant('INVALID_JOB_IDS'));
```

---

**File:** `src/app/components/sidebar/save-user-filters/save-user-filter/save-user-filter.component.ts`

**Before:**
```typescript
this.notificationService.info(\`Applied filters \${fromName}\`);
```

**After:**
```typescript
this.notificationService.info(
  this.translateService.instant('APPLIED_FILTERS_FROM_NAME', { fromName })
);
```

---

**File:** `src/app/services/polygon-validation.service.ts`

**Before:**
```typescript
this.notificationService.info(report, 'Invalid Polygon', { timeOut: 4000 });
```

**After:**
```typescript
this.notificationService.info(
  report,
  this.translateService.instant('INVALID_POLYGON'),
  { timeOut: 4000 }
);
```

---

**File:** `src/app/components/shared/code-export/code-export.component.ts`

**Before:**
```typescript
this.notificationService.info('Copied to clipboard');
```

**After:**
```typescript
this.notificationService.info(this.translateService.instant('COPIED_TO_CLIPBOARD'));
```

---

**File:** `src/app/services/auth.service.ts`

**Before:**
```typescript
this.notificationService.error('Trouble logging in');
this.notificationService.error('Trouble logging out');
```

**After:**
```typescript
this.notificationService.error(this.translateService.instant('TROUBLE_LOGGING_IN'));
this.notificationService.error(this.translateService.instant('TROUBLE_LOGGING_OUT'));
```

---

## Step 4: Verification Checklist

After implementing all changes:

- [ ] All new keys added to `en.json`, `es.json`, and `de.json`
- [ ] Keys are in alphabetical order in all i18n files
- [ ] All HTML templates updated to use `{{ 'KEY' | translate }}` or `[attr]="'KEY' | translate"`
- [ ] All TypeScript files inject TranslateService where needed
- [ ] All `notificationService` calls use `translateService.instant()`
- [ ] Dynamic messages use proper interpolation syntax
- [ ] Run `ng build` to verify no errors
- [ ] Test in browser with English locale
- [ ] Test switching to Spanish and German locales
- [ ] Verify all text displays correctly in all languages
- [ ] Check console for any missing translation warnings

---

## Step 5: Testing Commands

```bash
# Build the application
npm run build

# Run in dev mode
ng serve

# Test with different languages by switching in the UI
# Or by adding ?lang=es or ?lang=de to the URL (if implemented)
```

---

## Notes

1. **BabelEdit**: The project uses BabelEdit (`assets/i18n/vertex.babel`) for managing translations. Consider using it for consistency.

2. **Existing Keys**: Some keys like `CANCEL`, `CLEAR`, `CLOSE` may already exist in en.json. Check before adding duplicates.

3. **Dynamic Interpolation**: For messages with variables, use the format:
   ```typescript
   this.translateService.instant('KEY', { variable1: value1, variable2: value2 })
   ```
   And in JSON:
   ```json
   "KEY": "Text with {variable1} and {variable2}"
   ```

4. **HTML Attribute Binding**: Always use property binding for dynamic attributes:
   - `[attr.aria-label]` not `aria-label`
   - `[matTooltip]` not `matTooltip`
   - `[placeholder]` not `placeholder`

5. **Priority Order**: Start with notification.service.ts (highest impact), then dialog buttons, then tooltips and placeholders.

---

## Estimated Effort

- **Adding keys to JSON files**: 30 minutes
- **Updating HTML templates**: 2-3 hours
- **Updating TypeScript files**: 2-3 hours
- **Testing all changes**: 1-2 hours
- **Total**: 6-9 hours

---

## Questions?

If you encounter any issues during implementation:
1. Check that TranslateService is properly injected
2. Verify import statement: `import { TranslateService } from '@ngx-translate/core';`
3. Check browser console for "Missing translation" warnings
4. Verify JSON syntax (no trailing commas, proper escaping)
