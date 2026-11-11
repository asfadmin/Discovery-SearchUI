import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { form, FormField, required, validate } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { AoiOptionsComponent } from '@components/shared/aoi-options/aoi-options.component';

interface BridgeSubmitModel {
  useSubset: boolean;
  startDate: Date | null;
  endDate: Date | null;
  cropThreshold: boolean;
}

export type BridgeSubmitResult = BridgeSubmitModel;

@Component({
  selector: 'app-bridge-submit-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
  imports: [
    FormField,
    AoiOptionsComponent,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  template: `
    <div class="header">
      <h2 mat-dialog-title>NISAR CV</h2>
      <button mat-icon-button type="button" mat-dialog-close aria-label="Close">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content>
      <mat-checkbox [formField]="bridgeForm.useSubset"
        >Subset using Area of Interest</mat-checkbox
      >

      <app-aoi-options [showHeader]="false" />

      <div class="date-row">
        <div class="date-field">
          <mat-form-field appearance="outline">
            <mat-label>Start date</mat-label>
            <input
              matInput
              [matDatepicker]="startPicker"
              [formField]="bridgeForm.startDate"
            />
            <mat-datepicker-toggle matIconSuffix [for]="startPicker" />
            <mat-datepicker #startPicker />
          </mat-form-field>
          @if (bridgeForm.startDate().touched()) {
            @for (error of bridgeForm.startDate().errors(); track error.kind) {
              <p class="field-error">{{ error.message }}</p>
            }
          }
        </div>

        <div class="date-field">
          <mat-form-field appearance="outline">
            <mat-label>End date</mat-label>
            <input
              matInput
              [matDatepicker]="endPicker"
              [formField]="bridgeForm.endDate"
            />
            <mat-datepicker-toggle matIconSuffix [for]="endPicker" />
            <mat-datepicker #endPicker />
          </mat-form-field>
          @if (bridgeForm.endDate().touched()) {
            @for (error of bridgeForm.endDate().errors(); track error.kind) {
              <p class="field-error">{{ error.message }}</p>
            }
          }
        </div>
      </div>
      @if (bridgeForm.endDate().touched()) {
        @for (error of bridgeForm.endDate().errors(); track error.kind) {
          <p class="field-error">{{ error.message }}</p>
        }
      }

      <mat-checkbox [formField]="bridgeForm.cropThreshold"
        >Crop threshold</mat-checkbox
      >
    </mat-dialog-content>

    <footer mat-dialog-actions align="end">
      <button mat-button type="button" mat-dialog-close>Cancel</button>
      <button
        mat-flat-button
        type="button"
        [disabled]="bridgeForm().invalid()"
        (click)="submit()"
      >
        Submit
      </button>
    </footer>
  `,
  styles: `
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    mat-dialog-content {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .field-error {
      color: var(--mat-sys-error);
      margin: 0;
      font-size: 0.75rem;
    }

    footer[mat-dialog-actions] {
      border-top: 1px solid var(--mat-sys-outline-variant);
      padding: 1rem 1.5rem;
    }

    .date-row {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .date-field {
      flex: 1 1 200px;
      min-width: 0;

      mat-form-field {
        width: 100%;
      }
    }
  `,
})
export class BridgeSubmitDialogComponent {
  private readonly dialogRef = inject(
    MatDialogRef<BridgeSubmitDialogComponent, BridgeSubmitResult>,
  );

  private readonly model = signal<BridgeSubmitModel>({
    useSubset: false,
    startDate: null,
    endDate: null,
    cropThreshold: false,
  });

  protected readonly bridgeForm = form(this.model, (path) => {
    required(path.startDate, { message: 'Start date is required' });
    required(path.endDate, { message: 'End date is required' });

    validate(path.endDate, ({ value, valueOf }) => {
      const start = valueOf(path.startDate);
      const end = value();
      return start && end && end < start
        ? {
            kind: 'endBeforeStart',
            message: 'End date must be on or after the start date',
          }
        : undefined;
    });
  });

  protected submit(): void {
    if (this.bridgeForm().invalid()) {
      return;
    }
    this.dialogRef.close(this.bridgeForm().value());
  }
}
