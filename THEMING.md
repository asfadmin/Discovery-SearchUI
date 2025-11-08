# Theming Guide

This document explains the theming system and best practices for styling components in the Discovery SearchUI application.

## Overview

The application uses a **multi-layered theming approach**:

1. **SCSS Theme Variables** - Compile-time theme values
2. **CSS Custom Properties** - Runtime theme values
3. **Design Tokens** - Semantic design system values
4. **Angular Material Theming** - Component library theming

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

Spacing:
- `--spacing-xs` (4px)
- `--spacing-sm` (8px)
- `--spacing-md` (16px)
- `--spacing-lg` (24px)
- `--spacing-xl` (32px)

Other:
- `--radius-sm`, `--radius-md`, `--radius-lg`
- `--shadow-sm`, `--shadow-md`, `--shadow-lg`
- `--transition-fast`, `--transition-base`, `--transition-slow`
- `--z-dropdown`, `--z-modal`, `--z-tooltip`

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
- `spacing($key)` - xs, sm, md, lg, xl, xxl
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

### 3. Avoid `::ng-deep`

✅ **Good:**
```scss
// For component-internal elements
:host .my-element {
  color: var(--asf-primary);
}

// For global styles (move to global stylesheet)
.mat-mdc-button {
  color: var(--asf-primary);
}
```

❌ **Avoid:**
```scss
::ng-deep .my-element {
  color: var(--asf-primary);
}
```

### 4. Minimize `!important`

Use increased specificity instead:

✅ **Good:**
```scss
.mat-mdc-menu-panel .mat-mdc-menu-item {
  background: var(--asf-background-white);
}
```

❌ **Avoid:**
```scss
.mat-mdc-menu-item {
  background: var(--asf-background-white) !important;
}
```

## Theme Switching

The application supports light and dark themes via CSS classes:

```html
<!-- Light theme (default) -->
<body class="theme-light">

<!-- Dark theme -->
<body class="theme-dark">
```

CSS variables automatically update when the theme class changes, providing instant theme switching without recompilation.

## File Organization

```
src/styles/
├── _tokens.scss           # Design tokens (spacing, typography, etc.)
├── _css-variables.scss    # CSS custom properties for theming
├── _variables.scss        # Legacy color definitions
├── _dark_variables.scss   # Dark theme color definitions
├── _color-utils.scss      # Color manipulation utilities
├── asf-theme-variables.scss  # Theme system and mixins
├── asf-theme.scss         # Main theme file (Material theming)
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

## Resources

- [Design Tokens Documentation](./src/styles/_tokens.scss)
- [CSS Variables Documentation](./src/styles/_css-variables.scss)
- [Angular Material Theming Guide](https://material.angular.io/guide/theming)
- [CSS Custom Properties MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
