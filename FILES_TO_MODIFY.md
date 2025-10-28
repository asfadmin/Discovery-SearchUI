# Files to Modify for I18N Implementation

## Quick Reference List

### Priority 1 - High Impact (Start Here)

#### TypeScript Files - Notification Messages
1. `src/app/services/notification.service.ts` - **~20 hard-coded messages**
2. `src/app/services/auth.service.ts` - Login/logout error messages
3. `src/app/services/polygon-validation.service.ts` - Invalid polygon message
4. `src/app/components/header/dataset-header/aoi-filter/aoi-filter.component.ts` - Clipboard message
5. `src/app/components/shared/code-export/code-export.component.ts` - Clipboard message

#### HTML Files - Dialog Buttons
6. `src/app/components/results-menu/timeseries-results-menu/confirmation-dialog.html` - Cancel, Delete
7. `src/app/components/result-menu/scene-detail/image-dialog/image-dialog.component.html` - Close button
8. `src/app/components/map/banners/banner-dialog/banner-dialog.component.html` - Close button

---

### Priority 2 - Accessibility

#### HTML Files - Aria Labels
9. `src/app/components/sidebar/saved-searches/saved-searches.component.html` - Saved Search Type
10. `src/app/components/map/map-controls/view-selector/view-selector.component.html` - Map projection labels (3 instances)
11. `src/app/components/shared/aoi-options/aoi-options.component.html` - Clear label
12. `src/app/components/shared/chart-modal/chart-modal.component.html` - Chart config menu
13. `src/app/components/shared/aoi-options/interaction-selector/interaction-selector.component.html` - Font style

---

### Priority 3 - Tooltips

#### HTML Files - matTooltip Attributes
14. `src/app/components/results-menu/scene-files/scene-file/scene-file.component.html` - Close contents
15. `src/app/components/results-menu/scenes-list-header/scenes-list-header.component.html` - Copy ids/urls
16. `src/app/components/shared/selectors/mission-selector/mission-selector.component.html` - Clear mission
17. `src/app/components/shared/selectors/dataset-selector/dataset-selector.component.html` - HyP3 availability
18. `src/app/components/shared/selectors/job-product-name-selector/job-product-name-selector.component.html` - Clear filter
19. `src/app/components/results-menu/sbas-results-menu/sbas-results-menu.component.html` - Dataset tooltip
20. `src/app/components/results-menu/sbas-results-menu/sbas-sliders-two/sbas-sliders-two.component.html` - Frequency
21. `src/app/components/shared/aoi-options/sarviews-event-search-selector/sarviews-event-search-selector.component.html` - Event search help
22. `src/app/components/sidebar/saved-searches/saved-search/saved-search.component.html` - Update saved search

---

### Priority 4 - Form Inputs

#### HTML Files - Placeholder Text
23. `src/app/components/shared/selectors/other-selector/other-selector.component.html` - Group ID
24. `src/app/components/shared/selectors/job-product-name-selector/job-product-name-selector.component.html` - S1A placeholder
25. `src/app/components/shared/selectors/mission-selector/mission-selector.component.html` - Filter campaign
26. `src/app/components/header/processing-queue/processing-signup/processing-signup.component.html` - Signup placeholder
27. `src/app/components/results-menu/sbas-results-menu/sbas-sliders-two/sbas-sliders-two.component.html` - Meters, range placeholders

---

### Priority 5 - Other UI Elements

#### HTML Files - Various Text Content
28. `src/app/components/map/map.component.html` - Build SBAS SLC Stack
29. `src/app/components/help/help-pages/help-login/help-login.component.html` - Page title
30. `src/app/components/result-menu/scene-detail/image-dialog/image-dialog.component.html` - Virtual product label
31. `src/app/components/map/attributions/attributions.component.html` - Improve this map
32. `src/app/components/shared/search-button/search-button.component.html` - Send email title

#### TypeScript Files - Other Messages
33. `src/app/components/header/processing-queue/processing-signup/processing-signup.component.ts` - Form submitted
34. `src/app/components/filters-dropdown/custom-products-filters/job-id-selector/job-id-selector.component.ts` - Invalid job IDs
35. `src/app/components/sidebar/save-user-filters/save-user-filter/save-user-filter.component.ts` - Applied filters

---

## Translation Files (Must Update All)

### JSON Files
1. `src/assets/i18n/en.json` - Add all 58 new keys
2. `src/assets/i18n/es.json` - Add Spanish translations
3. `src/assets/i18n/de.json` - Add German translations

---

## File Count Summary

- **TypeScript Files**: 8 files
- **HTML Template Files**: 27 files
- **Translation JSON Files**: 3 files
- **Total Files to Modify**: 38 files

---

## Implementation Strategy

### Option 1: File-by-File (Recommended for Testing)
Work through files in priority order, testing after each file:
1. Add all keys to JSON files first
2. Update notification.service.ts
3. Test notifications
4. Update dialog buttons
5. Test dialogs
6. Continue through priorities

### Option 2: Batch by Type
1. Add all keys to JSON files
2. Update all TypeScript files at once
3. Update all HTML files at once
4. Test everything together

### Option 3: Component-by-Component
Update all files related to each component together:
- All saved-searches files
- All selector files
- All results-menu files
- etc.

---

## Search Commands to Find Files

```bash
# Find all hard-coded aria-label attributes
grep -r 'aria-label="' src/app/components --include="*.html"

# Find all hard-coded matTooltip attributes
grep -r 'matTooltip="' src/app/components --include="*.html"

# Find all hard-coded placeholder attributes
grep -r 'placeholder="' src/app/components --include="*.html"

# Find notificationService.info calls in TypeScript
grep -r "notificationService.info('" src/app --include="*.ts"

# Find notificationService.error calls in TypeScript
grep -r "notificationService.error('" src/app --include="*.ts"
```

---

## Common Patterns

### HTML String → Translate Pipe
```html
<!-- Before -->
<button>Cancel</button>

<!-- After -->
<button>{{ 'CANCEL' | translate }}</button>
```

### HTML Attribute → Property Binding
```html
<!-- Before -->
<input placeholder="Search">

<!-- After -->
<input [placeholder]="'SEARCH' | translate">
```

### TypeScript String → TranslateService
```typescript
// Before
this.notificationService.info('Success!');

// After
this.notificationService.info(
  this.translateService.instant('SUCCESS')
);
```

### Dynamic Message with Variables
```typescript
// Before
const msg = `Added ${count} items`;
this.notificationService.info(msg);

// After
this.notificationService.info(
  this.translateService.instant('ITEMS_ADDED', { count })
);

// In en.json:
// "ITEMS_ADDED": "Added {count} items"
```
