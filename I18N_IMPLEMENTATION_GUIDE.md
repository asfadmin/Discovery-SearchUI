# I18N Implementation Guide

Guide for implementing 58 missing translation keys in Discovery SearchUI.

## Summary

| Category | Count |
|----------|-------|
| Dialog Buttons | 2 |
| Map & Visualization | 6 |
| Accessibility Labels | 4 |
| Tooltips | 7 |
| Form Placeholders | 7 |
| Notification Messages | 22 |
| Scene/Product Labels | 1 |
| Help Pages | 1 |
| Actions | 3 |
| Dynamic Templates | 5 |
| **Total** | **58** |

## Implementation Steps

### 1. Add Translation Keys

**Files:** `src/assets/i18n/en.json`, `es.json`, `de.json`

1. Copy keys from `TRANSLATION_KEYS_TO_ADD.json`
2. Add to `en.json` alphabetically
3. Use BabelEdit (`assets/i18n/vertex.babel`) to translate to Spanish/German

### 2. Update HTML Templates

Common patterns:

```html
<!-- Static text -->
<button>Cancel</button>
→ <button>{{ 'CANCEL' | translate }}</button>

<!-- Tooltips (use property binding) -->
<button matTooltip="Close contents">
→ <button [matTooltip]="'CLOSE_CONTENTS' | translate">

<!-- Placeholders -->
<input placeholder="Group ID">
→ <input [placeholder]="'GROUP_ID' | translate">

<!-- Aria labels -->
<button aria-label="Arctic map projection">
→ <button [attr.aria-label]="'ARCTIC_MAP_PROJECTION' | translate">

<!-- Async pipe with variables -->
<div *ngIf="items$ | async as items">
→ @if (items$ | async; as items) {
```

### 3. Update TypeScript Files

**Inject TranslateService:**
```typescript
import { TranslateService } from '@ngx-translate/core';

constructor(private translateService: TranslateService) {}
```

**Simple strings:**
```typescript
this.notification.info('Search Link Copied');
→ this.notification.info(this.translateService.instant('SEARCH_LINK_COPIED'));
```

**With interpolation:**
```typescript
this.notification.info(`Applied filters ${fromName}`);
→ this.notification.info(
  this.translateService.instant('APPLIED_FILTERS_FROM_NAME', { fromName })
);
```

**JSON format for interpolation:**
```json
"APPLIED_FILTERS_FROM_NAME": "Applied filters {fromName}"
```

### 4. Key File Changes

#### notification.service.ts (22 replacements)

| Line | Hard-coded String | Translation Key |
|------|------------------|-----------------|
| 38 | 'All jobs submitted were duplicates' | ALL_JOBS_DUPLICATES |
| 40 | 'Job submitted was a duplicate' | JOB_DUPLICATE |
| 45 | Template with job type/action | JOBS_ACTION_QUEUE_TITLE |
| 60 | 'Click here to open registration form' | CLICK_TO_OPEN_REGISTRATION_FORM |
| 78 | 'Scenes Added' | SCENES_ADDED |
| 88 | 'Search Link Copied' | SEARCH_LINK_COPIED |
| 92 | 'API URL Copied' | API_URL_COPIED |
| 99 | 'Clipboard Updated' | CLIPBOARD_UPDATED |
| 142 | 'Filters dismissed and not applied' | FILTERS_DISMISSED_NOT_APPLIED |
| 156 | '${fileExtension} List Import Failed' | LIST_IMPORT_FAILED |

#### Other Critical Files

| File | Line | Hard-coded String | Translation Key |
|------|------|------------------|-----------------|
| confirmation-dialog.html | - | Cancel / Delete | CANCEL / DELETE |
| image-dialog.component.html | - | Close | CLOSE_DIALOG |
| map.component.html | - | Build SBAS SLC Stack | BUILD_SBAS_SLC_STACK |
| view-selector.component.html | - | Arctic/Equatorial/Antarctic map projection | ARCTIC/EQUATORIAL/ANTARCTIC_MAP_PROJECTION |
| scene-file.component.html | - | Close contents | CLOSE_CONTENTS |
| scenes-list-header.component.html | - | Copy ids/urls | COPY_IDS_URLS |
| help-login.component.html | - | Getting an EarthData ID... | GETTING_EARTHDATA_ID_AND_LOGGING_IN |
| sbas-sliders-two.component.html | - | Meters / daysRange.start/end | METERS / DAYS_RANGE_START/END |
| auth.service.ts | - | Trouble logging in/out | TROUBLE_LOGGING_IN / TROUBLE_LOGGING_OUT |

### 5. Verification Checklist

- [ ] Keys added to `en.json`, `es.json`, `de.json` (alphabetically)
- [ ] HTML templates use `{{ 'KEY' | translate }}` or `[attr]="'KEY' | translate"`
- [ ] TypeScript files inject TranslateService
- [ ] Notification calls use `translateService.instant()`
- [ ] Dynamic messages use interpolation
- [ ] `ng build` succeeds
- [ ] Test in all languages (en/es/de)
- [ ] Check console for missing translation warnings

### 6. Testing

```bash
npm run build          # Verify no errors
ng serve              # Test in browser
# Switch languages in UI to verify all translations
```

## Important Notes

1. **Property Binding:** Always use `[attr.aria-label]`, `[matTooltip]`, `[placeholder]` for dynamic values
2. **Interpolation:** Use `{ variable }` in JSON, pass object to `instant()`
3. **Existing Keys:** Check for duplicates (CANCEL, CLEAR, CLOSE may exist)
4. **BabelEdit:** Use for consistency when managing translations
5. **Priority:** Start with notification.service.ts (highest impact), then dialogs, then tooltips

## Questions?

- Verify TranslateService injection and import
- Check browser console for "Missing translation" warnings
- Validate JSON syntax (no trailing commas)
