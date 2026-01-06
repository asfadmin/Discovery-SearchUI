# Radio Button Toggle Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the heavy mat-button-toggle-group with integrated radio buttons in the project name dialog.

**Architecture:** Swap `MatButtonToggleModule` for `MatRadioModule`. Restructure the template so the input field sits between the two radio options, visually nested under the "Rename" choice. Update SCSS to indent the input and remove old toggle styles.

**Tech Stack:** Angular Material (`MatRadioModule`), ngx-translate (i18n), Angular signals

**Design Reference:** `docs/plans/2026-01-05-radio-button-toggle-design.md`

---

## Task 1: Add Translation Keys

**Files:**
- Modify: `src/assets/i18n/en.json`
- Modify: `src/assets/i18n/es.json`
- Modify: `src/assets/i18n/de.json`

**Step 1: Add English translation keys**

Open `src/assets/i18n/en.json` and add these keys (alphabetically where appropriate):

```json
"RENAME_JOB_TO": "Rename job to:",
"RENAME_JOBS_TO": "Rename {{count}} jobs to:",
"REMOVE_PROJECT_NAME": "Remove project name",
"REMOVE_PROJECT_NAMES": "Remove {{count}} project names",
```

**Step 2: Add Spanish translation keys**

Open `src/assets/i18n/es.json` and add:

```json
"RENAME_JOB_TO": "Renombrar trabajo a:",
"RENAME_JOBS_TO": "Renombrar {{count}} trabajos a:",
"REMOVE_PROJECT_NAME": "Eliminar nombre del proyecto",
"REMOVE_PROJECT_NAMES": "Eliminar {{count}} nombres de proyecto",
```

**Step 3: Add German translation keys**

Open `src/assets/i18n/de.json` and add (placeholder - may need native review):

```json
"RENAME_JOB_TO": "Job umbenennen zu:",
"RENAME_JOBS_TO": "{{count}} Jobs umbenennen zu:",
"REMOVE_PROJECT_NAME": "Projektname entfernen",
"REMOVE_PROJECT_NAMES": "{{count}} Projektnamen entfernen",
```

**Step 4: Commit**

```bash
git add src/assets/i18n/*.json
git commit -m "feat(i18n): add translation keys for radio button toggle"
```

---

## Task 2: Update Component Imports

**Files:**
- Modify: `src/app/components/shared/project-name-dialog/project-name-dialog.component.ts`

**Step 1: Replace MatButtonToggleModule with MatRadioModule**

In `project-name-dialog.component.ts`, find the imports section:

```typescript
import { MatButtonToggleModule } from '@angular/material/button-toggle';
```

Replace with:

```typescript
import { MatRadioModule } from '@angular/material/radio';
```

**Step 2: Update component decorator imports array**

Find `MatButtonToggleModule` in the `imports` array and replace with `MatRadioModule`:

```typescript
imports: [
  // ... other imports
  MatRadioModule,  // was: MatButtonToggleModule
  // ... other imports
],
```

**Step 3: Verify no compile errors**

Run: `npx tsc --noEmit`

Expected: No errors related to the component

**Step 4: Commit**

```bash
git add src/app/components/shared/project-name-dialog/project-name-dialog.component.ts
git commit -m "refactor(project-name-dialog): replace button toggle with radio module"
```

---

## Task 3: Update Template Structure

**Files:**
- Modify: `src/app/components/shared/project-name-dialog/project-name-dialog.component.html`

**Step 1: Remove the button toggle section**

Find and delete this entire section (around lines 19-27):

```html
<section class="selection-type-toggle">
  <mat-button-toggle-group
    [(value)]="projectEditType"
    name="projectEditType"
    aria-label="projectEditType">
    <mat-button-toggle value="edit">Edit</mat-button-toggle>
    <mat-button-toggle value="remove">Remove</mat-button-toggle>
  </mat-button-toggle-group>
</section>
```

**Step 2: Add radio group with integrated input**

Replace the removed section AND the existing `@if (isEditMode())` block containing the mat-form-field with this new structure. Place it right after `<mat-dialog-content>`:

```html
<mat-radio-group
  [(ngModel)]="projectEditType"
  name="projectEditType"
  class="project-edit-radio-group"
>
  <mat-radio-button value="edit">
    @if (jobCount <= 1) {
      {{ 'RENAME_JOB_TO' | translate }}
    } @else {
      {{ 'RENAME_JOBS_TO' | translate: { count: jobCount } }}
    }
  </mat-radio-button>

  <mat-form-field class="project-name-field" [class.disabled]="isRemoveMode()">
    <mat-label>{{ 'PROJECT_NAME' | translate }}</mat-label>
    <input
      #projectNameInput
      matInput
      [ngModel]="projectName()"
      (ngModelChange)="projectName.set($event)"
      name="projectName"
      maxlength="100"
      required
      [disabled]="isDisabledByUserFilter || isRemoveMode()"
    />
    <mat-hint align="end">{{ projectName()?.length || 0 }}/100</mat-hint>
    @if (!projectName()?.trim()) {
      <mat-error>{{ 'PROJECT_NAME_REQUIRED' | translate }}</mat-error>
    } @else if (projectName()?.length >= 100) {
      <mat-error>{{ 'PROJECT_NAME_MAX_LENGTH' | translate }}</mat-error>
    }
  </mat-form-field>

  <mat-radio-button value="remove">
    @if (projectCount <= 1) {
      {{ 'REMOVE_PROJECT_NAME' | translate }}
    } @else {
      {{ 'REMOVE_PROJECT_NAMES' | translate: { count: projectCount } }}
    }
  </mat-radio-button>
</mat-radio-group>
```

**Step 3: Verify no compile errors**

Run: `npx tsc --noEmit`

Expected: No errors

**Step 4: Commit**

```bash
git add src/app/components/shared/project-name-dialog/project-name-dialog.component.html
git commit -m "feat(project-name-dialog): integrate input with radio button layout"
```

---

## Task 4: Update Styles

**Files:**
- Modify: `src/app/components/shared/project-name-dialog/project-name-dialog.component.scss`

**Step 1: Remove old toggle styles**

Find and delete this block:

```scss
.selection-type-toggle {
  margin: 8px 16px;
}
```

**Step 2: Add radio group layout styles**

Add after the `.dialog-subtitle` block (around line 28):

```scss
// Radio group layout for edit/remove toggle
.project-edit-radio-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}
```

**Step 3: Update project-name-field styles**

Find the existing `.project-name-field` block and update it to:

```scss
.project-name-field {
  margin-left: 32px;
  width: calc(100% - 32px);

  .mat-mdc-text-field-wrapper {
    padding-top: 0;
  }

  // Subtle disabled state when "Remove" is selected
  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}
```

**Step 4: Add radio button label styling**

Add after the `.project-name-field` block:

```scss
// Radio button label sizing
.mat-mdc-radio-button {
  .mdc-label {
    font-size: 14px;
  }
}
```

**Step 5: Verify styles compile**

Run: `ng build --configuration=development` (or let ng serve do it)

Expected: No SCSS compile errors

**Step 6: Commit**

```bash
git add src/app/components/shared/project-name-dialog/project-name-dialog.component.scss
git commit -m "style(project-name-dialog): add radio group layout styles"
```

---

## Task 5: Visual Verification

**Step 1: Start the dev server**

Run: `ng serve`

Navigate to: `http://localhost:4200/`

**Step 2: Open the project name dialog**

1. Log in to the application
2. Run a search that returns Hyp3 jobs with project names
3. Select multiple jobs
4. Click the "Edit Project Name" option (via the menu or header action)

**Step 3: Verify the layout**

Check these behaviors:

- [ ] Radio buttons appear vertically with "Rename jobs to:" at top
- [ ] Input field is indented under the "Rename" radio button
- [ ] "Remove project names" radio button appears below the input
- [ ] Selecting "Remove" disables and dims the input field
- [ ] Selecting "Rename" enables the input field
- [ ] Singular/plural text changes based on job/project count
- [ ] Keyboard navigation works (arrow keys between radio options)

**Step 4: Test both light and dark themes**

Toggle the theme and verify the styling works in both modes.

**Step 5: Test the full flow**

1. Select "Rename", enter a name, confirm checkbox, click Save
2. Verify the rename operation completes successfully
3. Repeat with "Remove" option selected

---

## Task 6: Final Commit

**Step 1: Verify all changes**

Run: `git status`

Ensure only the expected files are modified.

**Step 2: Run linter**

Run: `npm run lint`

Fix any issues that arise.

**Step 3: Final commit (if any lint fixes)**

```bash
git add -A
git commit -m "chore: lint fixes"
```

---

## Summary of Files Modified

| File | Change |
|------|--------|
| `src/assets/i18n/en.json` | Add 4 translation keys |
| `src/assets/i18n/es.json` | Add 4 translation keys |
| `src/assets/i18n/de.json` | Add 4 translation keys |
| `src/app/components/shared/project-name-dialog/project-name-dialog.component.ts` | Swap MatButtonToggleModule → MatRadioModule |
| `src/app/components/shared/project-name-dialog/project-name-dialog.component.html` | Replace toggle with radio group + integrated input |
| `src/app/components/shared/project-name-dialog/project-name-dialog.component.scss` | Remove toggle styles, add radio group styles |
