# !important Reduction Strategy

This document outlines the approach for eliminating `!important` declarations across the codebase.

## Current Status
- **Total `!important` usage**: 291 occurrences across 69 files
- **Target**: Reduce by 70%+ using proper CSS specificity and Material theming

## Top Offenders (Priority Fixes)

### 1. `background-color: var(--asf-surface) !important` (8 occurrences)
**Solution**: Use utility classes instead

```scss
// Instead of inline !important in components:
.my-element {
  background-color: var(--asf-surface) !important;
}

// Use utility class from _material-density-overrides.scss:
<div class="bg-surface">...</div>
```

### 2. `font-size: 16px !important` (7 occurrences)
**Solution**: Use Material typography or utility classes

```scss
// Instead of:
.button-text {
  font-size: 16px !important;
}

// Use Material button with proper typography config (already in global styles)
<button class="button-compact">Text</button>
```

### 3. `display: flex !important` (7 occurrences)
**Solution**: Increase specificity or use utility classes

```scss
// Instead of:
.mat-element {
  display: flex !important;
}

// Increase specificity:
app-component .mat-element {
  display: flex;
}
```

### 4. `box-shadow: none !important` (7 occurrences)
**Solution**: Use utility class

```html
<!-- Add class to element -->
<mat-card class="card-flat">
```

## Implementation Strategy

### Phase 1: Create Utility Classes (✅ Complete)
Created in `src/styles/_material-density-overrides.scss`:
- `.button-compact`, `.button-small` - Button sizing
- `.card-flat`, `.card-elevated` - Card shadows
- `.form-field-dense` - Form field density
- `.chip-compact` - Chip sizing
- `.toggle-compact` - Toggle sizing
- `.icon-sm`, `.icon-md`, `.icon-lg` - Icon sizing

### Phase 2: Component-Level Replacements

####Fix Pattern A: Replace with Utility Class
```scss
// BEFORE
.custom-card {
  box-shadow: none !important;
}

// AFTER
// In template: <mat-card class="card-flat custom-card">
.custom-card {
  // Other styles
}
```

#### Fix Pattern B: Increase Specificity
```scss
// BEFORE
.mat-icon {
  font-size: 18px !important;
}

// AFTER
:host .mat-icon,
app-my-component .mat-icon {
  font-size: 18px;
}
```

#### Fix Pattern C: Use CSS Variables
```scss
// BEFORE
.slider {
  height: 27px !important;
}

// AFTER - Define in component
.slider {
  height: var(--slider-height, 27px);
}
```

## Acceptable !important Usage

Keep `!important` ONLY for:
1. **Utility classes** (e.g., `.hidden { display: none !important; }`)
2. **Third-party library overrides** when no other option exists
3. **CSS variable fallbacks** in rare cases

## Files to Prioritize

High-impact files (multiple !important instances):
1. `src/app/components/header/dataset-header/dataset-header.component.scss` (9 instances)
2. `src/app/components/header/processing-queue/processing-queue.component.scss` (3 instances)
3. `src/app/components/map/displacement-layers/displacement-layers.component.scss` (2 instances)

## Tracking Progress

| Category | Before | After | Reduction |
|----------|--------|-------|-----------|
| Font sizes | 20 | TBD | TBD |
| Box shadows | 12 | TBD | TBD |
| Display props | 7 | TBD | TBD |
| Backgrounds | 8 | TBD | TBD |
| **Total** | **291** | **TBD** | **TBD** |

## Next Steps

1. ✅ Create utility classes
2. ⏳ Update component templates to use utility classes
3. ⏳ Remove !important from component styles
4. ⏳ Run build and verify no regressions
5. ⏳ Update this document with final metrics
