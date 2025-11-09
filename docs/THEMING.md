# Theming Guide

This document explains the theming system and best practices for styling components in the Discovery SearchUI application.

## Overview

The application uses a **multi-layered theming approach**:

1. **SCSS Theme Variables** - Compile-time theme values
2. **CSS Custom Properties** - Runtime theme values with dynamic theme switching
3. **Design Tokens** - Semantic design system values
4. **Angular Material Theming** - Component library theming (M2 compatibility API)

## Quick Start

### Using CSS Custom Properties (Recommended for New Code)

CSS custom properties allow runtime theme switching and provide better performance.

```scss
.my-component {
  // Primary color
  color: var(--asf-primary);

  // Background
  background-color: var(--asf-background-white);

  // Text colors
  color: var(--asf-dark-primary-text);

  // Semantic colors
  border-color: var(--asf-borders);
  color: var(--asf-blue-link);
}
```

**Available CSS Variables:**

Theme colors:
- `--asf-primary`, `--asf-accent`, `--asf-warn`, `--asf-err`
- `--asf-primary-light`, `--asf-primary-dark`
- `--asf-blue-link`

Text colors:
- `--asf-dark-primary-text` (87% opacity)
- `--asf-dark-secondary-text` (54% opacity)
- `--asf-dark-disabled-text` (38% opacity)
- `--asf-light-primary-text` (white)
- `--asf-light-secondary-text` (70% white)

Backgrounds:
- `--asf-background-white`
- `--asf-surface`

**Color Variants** (for replacing `filter: brightness()`):
- `--asf-surface-dark-5`, `--asf-surface-dark-10`, `--asf-surface-dark-15`
- `--asf-primary-light-5`, `--asf-primary-light-7`, `--asf-primary-light-8`, `--asf-primary-light-10`, `--asf-primary-light-11`, `--asf-primary-light-15`, `--asf-primary-light-40`
- `--asf-dark-primary-text-dark-25`, `--asf-dark-primary-text-dark-15`, `--asf-dark-primary-text-light-10`, `--asf-dark-primary-text-light-20`
- `--asf-blue-link-dark-20`

Spacing:
- `--spacing-xs` (4px)
- `--spacing-sm` (8px)
- `--spacing-md` (16px)
- `--spacing-lg` (24px)
- `--spacing-xl` (32px)

Shadows:
- `--shadow-sm`, `--shadow-md`, `--shadow-lg`

Other:
- `--radius-sm`, `--radius-md`, `--radius-lg`
- `--transition-fast`, `--transition-base`, `--transition-slow`
- `--z-dropdown`, `--z-sticky`, `--z-modal`, `--z-tooltip`

### Using Design Tokens

For consistent spacing, typography, and other design values:

```scss
@use "tokens" as *;

.my-component {
  // Spacing
  margin: spacing(md);  // 16px
  padding: spacing(sm); // 8px

  // Typography
  font-size: font-size(base);      // 16px
  font-weight: font-weight(bold);  // 700

  // Opacity
  opacity: opacity(80);  // 0.8

  // Z-index
  z-index: z-index(modal);  // 1050
}
```

**Available Token Functions:**
- `spacing($key)` - xs, sm, md, lg, xl, xxl, plus numeric (1-5)
- `font-size($key)` - xs, sm, base, lg, xl, xxl, title
- `font-weight($key)` - light, normal, medium, semibold, bold
- `opacity($key)` - 0 to 100
- `z-index($key)` - base, dropdown, sticky, modal, tooltip

### Using SCSS Theme Variables (Legacy)

For advanced theming that responds to light/dark mode:

```scss
@use "asf-theme-variables" as *;

.my-component {
  @include themify($themes) {
    color: themed('dark-primary-text');
    background: themed('background-white');
    border-color: themed('borders');
  }
}
```

The `themify` mixin generates `:host-context(.theme-light)` and `:host-context(.theme-dark)` selectors automatically.

## Best Practices

### 1. Prefer CSS Variables for Simple Theming

✅ **Good:**
```scss
.header {
  background: var(--asf-primary);
  color: var(--asf-light-primary-text);
}
```

❌ **Avoid:**
```scss
.header {
  @include themify($themes) {
    background: themed('primary');
    color: themed('light-primary-text');
  }
}
```

### 2. Use Design Tokens for Spacing and Typography

✅ **Good:**
```scss
.card {
  padding: spacing(md);
  font-size: font-size(base);
  margin-bottom: spacing(lg);
}
```

❌ **Avoid:**
```scss
.card {
  padding: 16px;
  font-size: 16px;
  margin-bottom: 24px;
}
```

### 3. Avoid `::ng-deep` (Deprecated in Angular 20)

`::ng-deep` is deprecated and scheduled for removal. Use these alternatives:

✅ **Good:**
```scss
// Option 1: Use :host for increased specificity
:host .my-element {
  color: var(--asf-primary);
}

// Option 2: Move to global stylesheet for true global styles
// src/styles.scss
.mat-mdc-button {
  color: var(--asf-primary);
}

// Option 3: Use Angular Material's theming mixins
@use '@angular/material' as mat;

@include mat.button-theme($theme);
```

❌ **Avoid:**
```scss
::ng-deep .my-element {
  color: var(--asf-primary);
}
```

**Status:** All `::ng-deep` usage has been eliminated from the codebase (completed 2025-11).

### 4. Avoid `!important` - Use Increased Specificity

Using `!important` makes styles harder to override and maintain. Use CSS specificity instead:

✅ **Good - Use `:host` for component encapsulation:**
```scss
// Component SCSS file
:host .list-icon {
  font-size: 18px;
  height: 18px;
  width: 18px;
}

:host .mat-mdc-button {
  background-color: var(--asf-primary);
}
```

✅ **Good - Chain selectors for higher specificity:**
```scss
.baseline-criteria-button-toggle-group {
  flex: 0 1 auto;
}

:host .control-mat-button-toggle.mat-button-toggle-appearance-standard.cdk-focused {
  background-color: var(--asf-surface);
}
```

✅ **Good - Use Material's theming mixins:**
```scss
@use '@angular/material' as mat;

// Override via theme configuration
$custom-theme: mat.m2-define-light-theme((
  color: (
    primary: $asf-app-primary,
  )
));
```

❌ **Avoid:**
```scss
.list-icon {
  font-size: 18px !important;
  height: 18px !important;
  width: 18px !important;
}
```

**Progress:** 72 `!important` declarations removed from components (38% reduction, ongoing).

**Exceptions where `!important` is acceptable:**
- Global utility mixins (e.g., `md-icon-size`)
- Overriding third-party libraries with no other option
- Zero-border-radius enforcement for brand consistency

### 5. Use Color Variants Instead of `filter: brightness()`

CSS filters can cause performance issues and don't work well with theme switching.

✅ **Good:**
```scss
// Use pre-calculated color variants
.hover-state {
  background-color: var(--asf-primary-light-5);  // 5% lighter
}

.darkened-text {
  color: var(--asf-dark-primary-text-dark-25);  // 25% darker
}
```

❌ **Avoid:**
```scss
.hover-state {
  background-color: var(--asf-primary-light);
  filter: brightness(1.05);
}
```

**Available brightness replacements:**
- `brightness(0.75)` → `--asf-dark-primary-text-dark-25`
- `brightness(0.85)` → `--asf-dark-primary-text-dark-15` or `--asf-surface-dark-15`
- `brightness(0.9)` → `--asf-surface-dark-10`
- `brightness(1.05)` → `--asf-primary-light-5`
- `brightness(1.1)` → `--asf-primary-light-10`
- `brightness(1.15)` → `--asf-primary-light-15`
- `brightness(1.2)` → `--asf-dark-primary-text-light-20`

**Status:** All `filter: brightness()` usage eliminated from codebase (completed 2025-11).

### 6. Use Shadow Variables for Consistency

✅ **Good:**
```scss
.card {
  box-shadow: var(--shadow-md);
}

.elevated-card {
  box-shadow: var(--shadow-lg);
}
```

❌ **Avoid:**
```scss
.card {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}
```

### 7. Component-Specific Overrides Pattern

When overriding Angular Material components, use this pattern:

```scss
// Component SCSS file with ViewEncapsulation.Emulated (default)

// Pattern 1: Simple override with :host
:host .mat-mdc-button {
  height: 36px;
  border-radius: 0;
}

// Pattern 2: State-specific overrides
:host .mat-button-toggle.cdk-focused .list-icon {
  color: var(--asf-dark-primary-text);
}

// Pattern 3: Nested Material component overrides
:host .mat-mdc-list-base .mat-mdc-list-item .mat-list-item-content {
  padding: 0;
}
```

**Why this works:**
- `:host` adds the component's unique attribute selector (e.g., `[_nghost-ng-c123]`)
- This increases specificity beyond Material's default styles
- No `!important` needed
- Styles remain encapsulated to the component

## Theme Switching

The application supports light and dark themes via CSS classes:

```html
<!-- Light theme (default) -->
<body class="theme-light">

<!-- Dark theme -->
<body class="theme-dark">
```

CSS variables automatically update when the theme class changes, providing instant theme switching without recompilation.

**Theme-aware color variants:**
Each color variant has different values in light and dark themes. For example:
- Light theme: `--asf-surface-dark-5: #f5f5f5`
- Dark theme: `--asf-surface-dark-5: #2a2a2a`

## File Organization

```
src/styles/
├── _tokens.scss           # Design tokens (spacing, typography, etc.)
├── _css-variables.scss    # CSS custom properties for theming
├── _variables.scss        # Legacy color definitions
├── _dark_variables.scss   # Dark theme color definitions
├── _color-utils.scss      # Color manipulation utilities
├── _component-mixins.scss # Shared component styling mixins
├── asf-theme-variables.scss  # Theme system and mixins
├── asf-theme.scss         # Main theme file (Material theming)
├── _material-density-overrides.scss  # Material density customizations
└── deluxe-menu.scss       # Global component styles
```

## Migration Guide

### From Hard-coded Values to Tokens

**Before:**
```scss
.component {
  margin: 10px;
  font-size: 14px;
  font-weight: 400;
}
```

**After:**
```scss
@use "tokens" as *;

.component {
  margin: spacing(2);  // 8px (closest token)
  font-size: font-size(sm);
  font-weight: font-weight(normal);
}
```

### From `themify` Mixin to CSS Variables

**Before:**
```scss
@use "asf-theme-variables" as *;

.component {
  @include themify($themes) {
    color: themed('dark-primary-text');
    background: themed('background-white');
  }
}
```

**After:**
```scss
.component {
  color: var(--asf-dark-primary-text);
  background: var(--asf-background-white);
}
```

Benefits:
- Simpler syntax
- Better performance (no selector duplication)
- Runtime theme switching
- Easier to debug in DevTools

### From `!important` to Increased Specificity

**Before:**
```scss
.mat-mdc-button {
  background-color: var(--asf-primary) !important;
  height: 36px !important;
}
```

**After:**
```scss
:host .mat-mdc-button {
  background-color: var(--asf-primary);
  height: 36px;
}
```

### From `filter: brightness()` to Color Variants

**Before:**
```scss
.hover-effect {
  background-color: var(--asf-primary-light);

  &:hover {
    filter: brightness(1.05);
  }
}
```

**After:**
```scss
.hover-effect {
  background-color: var(--asf-primary-light);

  &:hover {
    background-color: var(--asf-primary-light-5);
  }
}
```

## Common Patterns

### Card Component

```scss
@use "tokens" as *;

.card {
  background: var(--asf-surface);
  color: var(--asf-on-surface);
  padding: spacing(md);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  margin-bottom: spacing(lg);
}
```

### Button Component

```scss
@use "tokens" as *;

.primary-button {
  background: var(--asf-primary);
  color: var(--asf-on-primary);
  padding: spacing(sm) spacing(md);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);

  &:hover {
    opacity: opacity(90);
  }
}
```

### Modal Component

```scss
@use "tokens" as *;

.modal {
  position: fixed;
  z-index: z-index(modal);
  background: var(--asf-surface);
  padding: spacing(lg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}
```

### Zebra Striping with Color Variants

```scss
// Use color variants for subtle alternating backgrounds
:host .row:nth-child(odd) {
  background-color: var(--asf-primary-light-15);
}

:host .row:nth-child(even) {
  background-color: var(--asf-primary-light-7);
}
```

### Material Component Override

```scss
// Override Material button toggle groups
:host .baseline-criteria-button-toggle-group {
  flex: 0 1 auto;
  margin-top: -5px;
}

// Override Material list padding
:host .mat-mdc-list-base .mat-mdc-list-item .mat-list-item-content {
  padding: 0;
}

// Override focus states
:host .control-mat-button-toggle.mat-button-toggle-appearance-standard.cdk-focused {
  background-color: var(--asf-surface);
}
```

## Angular Material Theming

### Current State: Material 2 (M2) Compatibility API

The application currently uses Angular Material 20 with the M2 compatibility API:

```scss
// src/styles/asf-theme.scss
$asf-light-theme: mat.m2-define-light-theme((
  color: (
    primary: $asf-app-primary,
    accent: $asf-app-accent,
  ),
  typography: mat.m2-define-typography-config(),
  density: -1,
));
```

**Why M2 API:**
- Stable and well-documented
- Officially supported through Angular 20+
- Large existing codebase using M2 patterns
- M3 migration requires significant refactoring

### Material 3 (M3) Migration

Material 3 migration is **planned for future** (Q4 2025 or later).

**M3 Benefits:**
- Built-in dark theme support
- Modern token-based color system
- Improved accessibility
- New Material Design 3 visual language

**M3 Migration Challenges:**
- ~67 files with Material component overrides need updates
- Custom color palettes need conversion to M3 token format
- Different component DOM structure may break existing styles
- Visual regression testing required
- Estimated effort: 82-164 hours

**Recommendation:** Complete theming cleanup first (reduce `!important`, consolidate variables) before attempting M3 migration.

## Theming Improvements Status

### Completed (2025-11)
- ✅ **Eliminated all `::ng-deep` usage** - Replaced with `:host` or global styles
- ✅ **Eliminated all `filter: brightness()` usage** - Replaced with color variant CSS variables
- ✅ **Added color variant CSS variables** - 24+ pre-calculated color variants for light/dark themes
- ✅ **Reduced `!important` usage by 38%** - 72 declarations removed from 19 component files

### In Progress
- 🔄 **Continue reducing `!important` usage** - 117 remaining in component files
- 🔄 **Consolidate shadow definitions** - Some components still use hard-coded shadows
- 🔄 **Create shared component mixins** - Reduce duplication of common patterns

### Planned
- 📋 **Material 3 migration** - Planned for Q4 2025 or later
- 📋 **Semantic color tokens** - Add more semantic color variables (e.g., `--color-error`, `--color-success`)
- 📋 **Global utility classes** - For common Material overrides

## Troubleshooting

### CSS Variable Not Working

**Problem:** CSS variable shows as raw text
**Solution:** Ensure `_css-variables.scss` is imported in your component or globally

### Theme Not Switching

**Problem:** Component doesn't update when theme changes
**Solution:** Check that you're using CSS variables (e.g., `var(--asf-primary)`) instead of SCSS variables

### Token Function Not Found

**Problem:** `Unknown function 'spacing'`
**Solution:** Add `@use "tokens" as *;` to your component SCSS file

### Material Styles Not Overriding

**Problem:** Your styles aren't overriding Material defaults
**Solution:** Use `:host` prefix to increase specificity instead of `!important`:

```scss
// Won't work (too low specificity)
.mat-mdc-button {
  height: 36px;
}

// Will work (higher specificity)
:host .mat-mdc-button {
  height: 36px;
}
```

### Color Doesn't Change in Dark Theme

**Problem:** Color looks the same in both themes
**Solution:** Ensure you're using CSS variables, not SCSS variables or hard-coded values:

```scss
// ❌ Won't change - hard-coded
color: #236192;

// ❌ Won't change - SCSS variable (compile-time)
color: $asf-blue;

// ✅ Will change - CSS variable (runtime)
color: var(--asf-blue-link);
```

## Performance Considerations

1. **Prefer CSS variables over `themify()` mixin**
   - CSS variables: 1 rule, instant theme switching
   - `themify()`: 2 rules (light + dark), larger CSS bundle

2. **Use color variants instead of `filter: brightness()`**
   - Filters trigger GPU operations on every frame
   - Pre-calculated colors are static values

3. **Minimize shadow customization**
   - Use `var(--shadow-md)` instead of custom shadows
   - Reduces duplicate shadow definitions in CSS

4. **Use design tokens for spacing**
   - Consistent values enable better CSS compression
   - Easier for browser to optimize rendering

## Resources

- [Design Tokens Documentation](./src/styles/_tokens.scss)
- [CSS Variables Documentation](./src/styles/_css-variables.scss)
- [Component Mixins](./src/styles/_component-mixins.scss)
- [Angular Material Theming Guide](https://material.angular.io/guide/theming)
- [CSS Custom Properties MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Angular Component Styles Guide](https://angular.io/guide/component-styles)
