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
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
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

// Parameters for running NISAR_CV jobs
interface BridgeJobType {
  // Start date of CV calculation in YYYY-MM-DD format. (min: nisar launch day, max: today)
  starte_date: string;
  // End date of CV calculation in YYYY-MM-DD format. (min: nisar launch day, max: today)
  end_date: string;
  // NISAR relative orbit number. minimum: 1, maximum: 173
  relative_orbit: number;
  // A = Ascending, D = Descending
  orbit_direction: 'A' | 'B';
  // NISAR track frame number containing scene. minimum: 1, maximum: 176
  frame_number: number;
  // Polarization of input granules to use.
  pol: 'HHHH';
  // Geographic subset of the granules to use, in the format of a WKT string.
  subset: string | null;
  // Choose whether to generate a crop area classification map. If False, only a coefficient of variation file is created.
  crop_area_boolean: boolean;
  // Coefficient of variation threshold to use for crop area classification. min: 0, 0.6
  cv_threshold: number;
  // Backscatter threshold, in decibels, for watermask generation. Pixels with backscatter below this threshold in more than --water-fraction % of images are classified as water. default: -16.5
  water_threshold_db: number;
  // Fraction of images in which the backscatter of a pixel is below --water-threshold-db in order for the pixel to be classified as water. min: 0, default: 0.75
  water_fraction: number;
}
export interface BridgeSubmitDialogData {
  // NISAR relative orbit number. minimum: 1, maximum: 173
  relative_orbit: number;
  // A = Ascending, D = Descending
  orbit_direction: 'A' | 'B';
  // NISAR track frame number containing scene. minimum: 1, maximum: 176
  frame_number: number;
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
  styleUrl: './bridge-submit-dialog.component.scss',
  template: `
    <div class="header">
      <div class="header-title">
        <h2 mat-dialog-title>NISAR Bridge</h2>

        <button
          mat-icon-button
          type="button"
          mat-dialog-close
          aria-label="Close"
        >
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="application-selector">
        <div class="enabled clickable">Cropland Coefficent of Variation</div>
        <div class="disabled">Custom Soil Moisture</div>
        <div class="disabled">Forest Disturbance</div>
      </div>
    </div>

    <mat-dialog-content>
      <div class="nisar-frame-info">
        <div>Frame: {{ data.frame_number }}</div>
        <div>Relative Orbit: {{ data.relative_orbit }}</div>
        <div>Orbit Direction: {{ data.orbit_direction }}</div>
      </div>

      <h3>Subset Options</h3>
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
})
export class BridgeSubmitDialogComponent {
  private readonly dialogRef = inject(
    MatDialogRef<BridgeSubmitDialogComponent, BridgeSubmitResult>,
  );

  data = inject<BridgeSubmitDialogData>(MAT_DIALOG_DATA);

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

    const job: BridgeJobType = {
      starte_date: '', // Start date of CV calculation in YYYY-MM-DD format. (min: nisar launch day, max: today)
      end_date: '', // End date of CV calculation in YYYY-MM-DD format. (min: nisar launch day, max: today)
      relative_orbit: 42, // NISAR relative orbit number. minimum: 1, maximum: 173
      orbit_direction: 'A', // A = Ascending, D = Descending
      frame_number: 42, // NISAR track frame number containing scene. minimum: 1, maximum: 176
      pol: 'HHHH', // Polarization of input granules to use.
      subset: null, // Geographic subset of the granules to use, in the format of a WKT string.
      crop_area_boolean: true, // Choose whether to generate a crop area classification map. If False, only a coefficient of variation file is created.
      cv_threshold: 0.4, // Coefficient of variation threshold to use for crop area classification. min: 0, 0.6
      water_threshold_db: -16.5, // Backscatter threshold, in decibels, for watermask generation. Pixels with backscatter below this threshold in more than --water-fraction % of images are classified as water. default: -16.5
      water_fraction: 0.75, // Fraction of images in which the backscatter of a pixel is below --water-threshold-db in order for the pixel to be classified as water. min: 0, default: 0.75
    };

    console.log(job);
    this.dialogRef.close(this.bridgeForm().value());
  }
}
