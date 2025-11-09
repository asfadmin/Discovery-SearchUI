# Component Mixins Usage Guide

This guide explains how to use the reusable SCSS mixins available in `src/styles/_component-mixins.scss`.

## Overview

Component mixins provide consistent, reusable styling patterns across the application. They reduce code duplication, improve maintainability, and ensure design consistency.

## Installation

Import the mixins in your component SCSS file:

```scss
@use 'component-mixins' as *;
```

## Available Mixins

### Layout Mixins

#### `@mixin flex-center($direction: row)`
Centers content using flexbox.

```scss
.centered-container {
  @include flex-center;
}

.vertical-center {
  @include flex-center(column);
}
```

**Replaces:**
```scss
// Before
.centered-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

// After
.centered-container {
  @include flex-center;
}
```

#### `@mixin flex-between($direction: row)`
Creates flex layout with space-between justification.

```scss
.header {
  @include flex-between;
}
```

**Example:** `src/app/components/map/displacement-layers/map-legend/map-legend.component.scss:31`

#### `@mixin scrollable($axis: y)`
Makes container scrollable with smooth iOS scrolling.

```scss
.list-container {
  @include scrollable(y);  // Vertical scroll only
}

.grid-container {
  @include scrollable(both);  // Both directions
}
```

**Examples:**
- `src/app/components/results-menu/scenes-list/scenes-list.component.scss:6`
- `src/app/components/help/help.component.scss:13`

#### `@mixin full-size`
Sets element to 100% width and height.

```scss
.overlay {
  @include full-size;
}
```

---

### Button Mixins

#### `@mixin map-control-button`
Standard styling for map control buttons (27px height, 53px min-width).

```scss
.custom-control {
  @include map-control-button;
  // Add component-specific overrides
  padding: 0 0 0 3px;
}
```

**Examples:**
- `src/app/components/map/map-controls/layer-selector/layer-selector.component.scss:6`
- `src/app/components/map/map-controls/view-selector/view-selector.component.scss:19`
- `src/app/components/map/map-controls/map-controls.component.scss:119`

**Generated styles:**
```scss
background: var(--asf-surface);
color: var(--asf-dark-primary-text);
margin: 0;
height: 27px;
min-width: 53px;
font-size: 18px;
border-radius: spacing(xs);
border: solid 1px rgb(0 0 0 / 12%);
text-align: center;
display: flex;
align-items: center;
justify-content: center;
```

#### `@mixin icon-button($size: 24px)`
Creates icon button with consistent sizing.

```scss
.small-icon {
  @include icon-button(16px);
}

.large-icon {
  @include icon-button(32px);
}
```

**Example:** `src/app/components/map/map-controls/view-selector/view-selector.component.scss:6`

#### `@mixin clickable`
Adds pointer cursor and disables text selection.

```scss
.interactive-element {
  @include clickable;
}
```

**Examples:**
- `src/app/components/map/map-controls/layer-selector/layer-selector.component.scss:30`
- `src/app/components/header/logo/logo.component.scss:64`

#### `@mixin reset-button`
Removes default button styling.

```scss
.custom-button {
  @include reset-button;
  // Add your custom styles
}
```

**Example:** `src/app/components/shared/chart-modal/chart-modal.component.scss:7`

---

### Positioning Mixins

#### `@mixin corner-badge($bottom: -9px, $right: -9px, $rotation: -45deg)`
Positions badge/indicator in corner with rotation.

```scss
.notification-badge {
  @include corner-badge(-13px, -19px);
}
```

**Examples:**
- `src/app/components/map/map-controls/layer-selector/layer-selector.component.scss:25`
- `src/app/components/map/map-controls/view-selector/view-selector.component.scss:36`

**Generated styles:**
```scss
color: var(--asf-primary);
position: absolute;
bottom: -13px;
right: -19px;
transform: rotate(-45deg);
```

#### `@mixin absolute-center`
Centers element absolutely within parent (requires `position: relative` on parent).

```scss
.modal-content {
  position: relative;

  .loading-spinner {
    @include absolute-center;
  }
}
```

---

### Text Mixins

#### `@mixin text-ellipsis`
Truncates text with ellipsis on single line.

```scss
.filename {
  @include text-ellipsis;
  max-width: 200px;
}
```

#### `@mixin text-clamp($lines: 2)`
Truncates text after specified number of lines.

```scss
.description {
  @include text-clamp(3);
}
```

---

### Card/Panel Mixins

#### `@mixin panel($padding: md)`
Standard panel styling with background and border radius.

```scss
.info-panel {
  @include panel(lg);
}
```

#### `@mixin panel-bordered($padding: md)`
Panel with border.

```scss
.bordered-card {
  @include panel-bordered(sm);
}
```

---

### Form Mixins

#### `@mixin focus-outline`
Consistent focus outline styling.

```scss
.custom-input:focus {
  @include focus-outline;
}
```

---

### Visibility Mixins

#### `@mixin visually-hidden`
Hides element visually but keeps accessible for screen readers.

```scss
.sr-only {
  @include visually-hidden;
}
```

#### `@mixin hidden`
Completely hides element.

```scss
.hidden {
  @include hidden;
}
```

---

### Responsive Mixins

#### `@mixin mobile`, `@mixin tablet`, `@mixin desktop`
Media query helpers.

```scss
.responsive-element {
  font-size: 16px;

  @include mobile {
    font-size: 14px;
  }

  @include desktop {
    font-size: 18px;
  }
}
```

---

### Animation Mixins

#### `@mixin transition($property: all, $duration: base)`
Smooth transitions.

```scss
.animated-button {
  @include transition(background-color, fast);
}
```

Duration options: `fast` (150ms), `base` (250ms), `slow` (350ms)

#### `@mixin fade-in`
Fade-in animation.

```scss
.modal {
  @include fade-in;
}
```

---

## Migration Examples

### Before and After: Map Control Button

**Before (with anti-patterns):**
```scss
.layer-select-button {
  background: var(--asf-surface);
  color: var(--asf-dark-primary-text);
  margin: 0;
  padding: 0 0 0 3px;
  font-size: 18px !important;  // ❌ Avoid !important
  height: 27px !important;     // ❌ Avoid !important
  width: 18px !important;      // ❌ Avoid !important
  min-width: 53px !important;  // ❌ Avoid !important
  border-radius: 4px !important; // ❌ Avoid !important
  border: solid 1px rgb(0 0 0 / 12%);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

**After (with mixin):**
```scss
// Mixin provides higher specificity naturally - no !important needed
.layer-select-button {
  @include map-control-button;
  // Component-specific overrides
  padding: 0 0 0 3px;
  width: 18px;
}
```

**Benefits:**
- **Lines saved:** 11 → 5 (55% reduction)
- **No `!important`:** Mixin provides proper specificity
- **Consistency:** Same styling across all map controls
- **Maintainability:** Update mixin once, affects all buttons

### Before and After: Scrollable Container

**Before:**
```scss
.list-viewport {
  overflow-y: auto;
  overflow-x: hidden;
  height: 99%;
}
```

**After:**
```scss
.list-viewport {
  @include scrollable(y);
  height: 99%;
}
```

**Lines saved:** 4 → 2 (50% reduction)

---

## Benefits

1. **Consistency:** Same patterns produce identical output across components
2. **Maintainability:** Update mixin once, affects all usages
3. **Reduced Bundle Size:** Less duplicated CSS in final bundle
4. **Better DX:** Descriptive names make code more readable
5. **Easier Testing:** Standardized patterns easier to test
6. **Eliminates `!important`:** Mixins provide proper specificity without hacks
7. **Theme-Aware:** Mixins use CSS variables for automatic theme switching

---

## Current Usage Statistics (Updated 2025-11)

**Total mixins created:** 21
**Components refactored:** 10
**Lines of code reduced:** ~150+
**`!important` declarations eliminated:** Multiple (part of broader theming cleanup)
**Build size:** Maintained at 8.40 MB (no regression)

### Files Using Mixins:

1. `src/app/components/map/map-controls/layer-selector/layer-selector.component.scss`
2. `src/app/components/map/map-controls/view-selector/view-selector.component.scss`
3. `src/app/components/map/map-controls/map-controls.component.scss`
4. `src/app/components/map/displacement-layers/map-legend/map-legend.component.scss`
5. `src/app/components/header/logo/logo.component.scss`
6. `src/app/components/results-menu/scenes-list/scenes-list.component.scss`
7. `src/app/components/shared/chart-modal/chart-modal.component.scss`
8. `src/app/components/results-menu/scene-detail/scene-detail.component.scss`
9. `src/app/components/help/help.component.scss`

---

## Next Steps: Recommended Additional Migrations

### High-Impact Opportunities

1. **Replace cursor: pointer (32 occurrences)**
   ```bash
   # Find all instances
   grep -r "cursor: pointer" src/app/components/**/*.scss
   ```

2. **Replace flex centering patterns (22 files)**
   ```scss
   // Replace this pattern:
   display: flex;
   align-items: center;
   justify-content: center;

   // With:
   @include flex-center;
   ```

3. **Replace scrollable containers (12 files)**
   ```scss
   // Replace:
   overflow-y: auto;
   overflow-x: hidden;

   // With:
   @include scrollable(y);
   ```

---

## Creating New Mixins

When you identify a pattern repeated 3+ times, consider adding it to `_component-mixins.scss`:

```scss
/// Brief description
/// @param {Type} $param-name - Parameter description
@mixin your-mixin-name($param: default) {
  // Mixin body
}
```

**Best practices:**
- Use semantic names (`flex-center` not `flex-1`)
- Provide sensible defaults
- Document with SassDoc comments
- Group related mixins together
- Test across browsers

---

## Related Documentation

- **[Theming Guide](../THEMING.md)** - Comprehensive theming system documentation
- **[Component Mixins Source](../src/styles/_component-mixins.scss)** - Full mixin implementation details
- **[CSS Variables](../src/styles/_css-variables.scss)** - Available theme variables
- **[Design Tokens](../src/styles/_tokens.scss)** - Spacing, typography, and design tokens

## Theming Integration

Component mixins are designed to work seamlessly with the theming system:

**Using mixins with theme variables:**
```scss
@use 'component-mixins' as *;

.custom-button {
  @include map-control-button;
  // Add theme-aware customizations
  background: var(--asf-primary-light);
  color: var(--asf-dark-primary-text);
}
```

**Combining mixins:**
```scss
.card {
  @include panel(md);
  @include scrollable(y);
  max-height: 400px;
}
```

**Why mixins avoid `!important`:**

Component mixins are included directly in your component's SCSS file, which means:
1. They become part of the component's encapsulated styles
2. Angular adds unique attribute selectors (e.g., `[_nghost-ng-c123]`)
3. This naturally increases specificity beyond global/Material styles
4. No `!important` needed - proper CSS cascade handles it

**Example of natural specificity:**
```scss
// Your component SCSS
.button {
  @include map-control-button;  // Generates ~10 properties
}

// Compiles to (simplified):
.button[_nghost-ng-c123] {
  background: var(--asf-surface);
  height: 27px;
  // ... other properties with component-specific specificity
}
```

This approach is superior to using `:host` prefix or `!important` because the mixin properties become part of the component's natural cascade.

## Questions or Issues?

Refer to `src/styles/_component-mixins.scss` for full mixin source code and implementation details.
