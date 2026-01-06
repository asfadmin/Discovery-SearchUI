# Radio Button Toggle for Project Name Dialog

## Overview

Replace the large `mat-button-toggle-group` ("Edit" / "Remove" buttons) with a more compact, integrated radio button layout that makes the relationship between the action choice and the input field clearer.

## Current State

The dialog currently uses `MatButtonToggleModule` with two large toggle buttons at the top:

```html
<mat-button-toggle-group [(value)]="projectEditType">
  <mat-button-toggle value="edit">Edit</mat-button-toggle>
  <mat-button-toggle value="remove">Remove</mat-button-toggle>
</mat-button-toggle-group>
```

This feels visually heavy and disconnected from the input field below.

## Proposed Design

### Layout

```
┌─────────────────────────────────────────────────┐
│  Edit Project Names                             │
├─────────────────────────────────────────────────┤
│                                                 │
│  ◉ Rename jobs to:                              │
│    ┌─────────────────────────────────────────┐  │
│    │ My Project Name                     85  │  │
│    └─────────────────────────────────────────┘  │
│                                                 │
│  ○ Remove project names                         │
│                                                 │
│  ─────────────────────────────────────────────  │
│  Projects selected                              │
│  ┌─────────────────────────────────────────┐    │
│  │ Project Name              │ Jobs        │    │
│  │─────────────────────────────────────────│    │
│  │ Old Project               │ 12          │    │
│  │ Another Project           │ 5           │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  ☑ Rename 2 projects (17 jobs) to "My Pro..."   │
│                                                 │
│                          [Cancel]  [Save]       │
└─────────────────────────────────────────────────┘
```

### Behavior

- Selecting "Rename" enables and focuses the input field
- Selecting "Remove" disables the input field (grayed out)
- The input field is indented under its radio option to show the relationship
- Radio labels are singular/plural based on job/project count

## Implementation

### Component Changes

**Imports:** Replace `MatButtonToggleModule` with `MatRadioModule`:

```typescript
import { MatRadioModule } from '@angular/material/radio';

@Component({
  // ...
  imports: [
    // Remove: MatButtonToggleModule,
    MatRadioModule,
    // ... other imports
  ],
})
```

### Template Structure

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

### Styling

```scss
// Radio group layout
.project-edit-radio-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

// Indent input field under its radio option
.project-name-field {
  margin-left: 32px;  // Aligns with radio label text
  width: calc(100% - 32px);

  // Subtle disabled state when "Remove" is selected
  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}

// Radio button labels
.mat-mdc-radio-button {
  .mdc-label {
    font-size: 14px;
  }
}
```

**Removed styles:**
- Delete `.selection-type-toggle` block (no longer needed)

### Accessibility

- Radio group provides keyboard navigation (arrow keys between options)
- Input field disabled state communicated to screen readers
- Visual indentation reinforces the relationship between radio and input

## Translation Keys

New keys required (see `TRANSLATIONS_SCRATCH.md`):

| Key | English | Spanish |
|-----|---------|---------|
| `RENAME_JOB_TO` | Rename job to: | Renombrar trabajo a: |
| `RENAME_JOBS_TO` | Rename {{count}} jobs to: | Renombrar {{count}} trabajos a: |
| `REMOVE_PROJECT_NAME` | Remove project name | Eliminar nombre del proyecto |
| `REMOVE_PROJECT_NAMES` | Remove {{count}} project names | Eliminar {{count}} nombres de proyecto |

## Files to Modify

1. `src/app/components/shared/project-name-dialog/project-name-dialog.component.ts`
   - Replace `MatButtonToggleModule` import with `MatRadioModule`

2. `src/app/components/shared/project-name-dialog/project-name-dialog.component.html`
   - Replace button toggle group with radio group structure
   - Add singular/plural translation logic

3. `src/app/components/shared/project-name-dialog/project-name-dialog.component.scss`
   - Remove `.selection-type-toggle` styles
   - Add `.project-edit-radio-group` and related styles

4. `src/assets/i18n/en.json`
   - Add new translation keys

5. `src/assets/i18n/es.json`
   - Add new translation keys (Spanish)
