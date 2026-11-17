import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  form,
  FormField,
  required,
  validate,
  submit,
} from '@angular/forms/signals';
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
import { Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';

import { AoiOptionsComponent } from '@components/shared/aoi-options/aoi-options.component';
import * as models from '@models';
import { MapService, NotificationService } from '@services';
import { AppState } from '@store';
import * as hyp3Store from '@store/hyp3';
import * as searchStore from '@store/search';

interface BridgeSubmitModel {
  startDate: Date | null;
  endDate: Date | null;
}

// Parameters for running NISAR_CV jobs
interface BridgeJobParamters {
  // Start date of CV calculation in YYYY-MM-DD format. (min: nisar launch day, max: today)
  start_date: string;
  // End date of CV calculation in YYYY-MM-DD format. (min: nisar launch day, max: today)
  end_date: string;
  // NISAR relative orbit number. minimum: 1, maximum: 173
  relative_orbit: number;
  // A = Ascending, D = Descending
  orbit_direction: 'A' | 'D';
  // NISAR track frame number containing scene. minimum: 1, maximum: 176
  frame_number: number;
  // Polarization of input granules to use.
  pol: 'HHHH';
  // Geographic subset of the granules to use, in the format of a WKT string.
  subset: string | null;
  // Choose whether to generate a crop area classification map. If False, only a coefficient of variation file is created.
  crop_area: boolean;
  // Coefficient of variation threshold to use for crop area classification. min: 0, 0.6
  cv_threshold: number;
  // Backscatter threshold, in decibels, for watermask generation. Pixels with backscatter below this threshold in more than --water-fraction % of images are classified as water. default: -16.5
  water_threshold_db: number;
  // Fraction of images in which the backscatter of a pixel is below --water-threshold-db in order for the pixel to be classified as water. min: 0, default: 0.75
  water_fraction: number;
}

interface BridgeJobType {
  job_type: 'NISAR_CV';
  job_parameters: BridgeJobParamters;
}

export interface BridgeSubmitDialogData {
  // NISAR relative orbit number. minimum: 1, maximum: 173
  relative_orbit: number;
  // A = Ascending, D = Descending
  orbit_direction: 'A' | 'D';
  // NISAR track frame number containing scene. minimum: 1, maximum: 176
  frame_number: number;
}

export type BridgeSubmitResult = any; // TODO: a proper response interface

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

      <div class="date-row">
        <mat-form-field>
          <mat-label>Acquisition dates</mat-label>

          <mat-date-range-input
            [rangePicker]="picker"
            [min]="minDate"
            [max]="today()"
          >
            <input
              matStartDate
              placeholder="Start"
              [formField]="bridgeForm.startDate"
            />
            <input
              matEndDate
              placeholder="End"
              [formField]="bridgeForm.endDate"
            />
          </mat-date-range-input>

          <mat-datepicker-toggle matIconSuffix [for]="picker" />
          <mat-date-range-picker #picker />
        </mat-form-field>

        @for (
          field of [bridgeForm.startDate, bridgeForm.endDate];
          track $index
        ) {
          @if (field().touched() && field().invalid()) {
            @for (e of field().errors(); track e.kind) {
              <p class="error">{{ e.message }}</p>
            }
          }
        }
      </div>

      <h3>Subset Options</h3>
      <app-aoi-options [showHeader]="false" />
      @for (e of bridgeForm().errors(); track e.kind) {
        <p class="error">{{ e.message }}</p>
      }
    </mat-dialog-content>

    <footer mat-dialog-actions class="footer">
      <div>
        <button mat-button type="button" mat-dialog-close>Cancel</button>
      </div>
      <div class="submit-cluster">
        <div>Credits: {{ credits() }}</div>
        <div>
          <button
            mat-flat-button
            type="button"
            [disabled]="
              credits() <= 1 ||
              bridgeForm().invalid() ||
              bridgeForm().submitting()
            "
            (click)="onSubmit($event)"
          >
            {{ bridgeForm().submitting() ? 'Submitting…' : 'Submit' }}
          </button>
        </div>
      </div>
    </footer>
  `,
})
export class BridgeSubmitDialogComponent {
  private store$ = inject<Store<AppState>>(Store);
  private mapService = inject(MapService);
  private http = inject(HttpClient);
  private notificationService = inject(NotificationService);
  private readonly dialogRef =
    inject<MatDialogRef<BridgeSubmitDialogComponent, BridgeSubmitResult>>(
      MatDialogRef,
    );
  protected data = inject<BridgeSubmitDialogData>(MAT_DIALOG_DATA);

  protected user = toSignal<models.Hyp3User>(
    this.store$.select(hyp3Store.getHyp3User),
  );
  private wkt = toSignal(this.mapService.searchPolygon$);
  protected wktValidForSubset = computed(() => this.wkt()?.includes('POLYGON'));
  protected readonly credits = computed(
    () => this.user()?.quota?.remaining ?? 0,
  );

  readonly minDate = models.nisar.date.start;
  readonly today = signal(new Date());
  readonly todayYmd = computed(() => this.toYmd(this.today()));
  private readonly minYmd = this.toYmd(this.minDate);

  private readonly model = signal<BridgeSubmitModel>({
    startDate: null,
    endDate: null,
  });

  protected readonly bridgeForm = form(this.model, (path) => {
    required(path.startDate, { message: 'Start date is required' });
    required(path.endDate, { message: 'End date is required' });

    validate(path.startDate, ({ value }) => {
      const v = value();
      if (!v) return undefined;
      const ymd = this.toYmd(v);
      if (ymd < this.minYmd) {
        return {
          kind: 'min',
          message: `Start cannot be before ${this.minYmd}`,
        };
      }
      if (ymd > this.todayYmd()) {
        return { kind: 'max', message: 'Start cannot be in the future' };
      }
      return undefined;
    });

    validate(path.endDate, ({ value, valueOf }) => {
      const endDate = value();
      if (!endDate) return undefined;

      const endYmd = this.toYmd(endDate);

      if (endYmd > this.todayYmd()) {
        return { kind: 'max', message: 'End cannot be in the future' };
      }
      const startDate = valueOf(path.startDate);
      return startDate && endYmd < this.toYmd(startDate)
        ? { kind: 'range', message: 'End must be on or after start' }
        : undefined;
    });
  });

  toYmd(d: Date): string {
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${m}-${day}`;
  }

  readonly job = computed<BridgeJobType | null>(() => {
    const { startDate, endDate } = this.bridgeForm().value();
    if (!startDate || !endDate) {
      return null;
    }

    const subset = this.wktValidForSubset() ? this.wkt() : null;

    const { frame_number, relative_orbit, orbit_direction } = this.data;

    const job_parameters: BridgeJobParamters = {
      start_date: this.toYmd(startDate),
      end_date: this.toYmd(endDate),
      relative_orbit,
      orbit_direction,
      frame_number,
      subset,
      pol: 'HHHH',
      crop_area: true,
      cv_threshold: 0.4,
      water_threshold_db: -16.5,
      water_fraction: 0.75,
    };

    return {
      job_type: 'NISAR_CV',
      job_parameters,
    };
  });

  readonly results = signal<unknown[]>([]);

  async onSubmit(event: Event) {
    event.preventDefault();

    await submit(this.bridgeForm, async () => {
      const job = this.job();
      if (!job) {
        return undefined;
      }

      const bridgeJobsEndpoint = 'https://hyp3-bridge.asf.alaska.edu/jobs';

      try {
        const res = await firstValueFrom(
          this.http.post<models.Hyp3JobsResponse>(
            bridgeJobsEndpoint,
            { jobs: [job] },
            { withCredentials: true },
          ),
        );
        console.log(res);
        this.dialogRef.close(res);
        const numJobsSubmitted = res?.jobs?.length ?? 0;

        const jobText =
          numJobsSubmitted > 1 ? `${numJobsSubmitted} Jobs` : 'Job';

        this.notificationService
          .info(`Click to view Submitted Products.`, `${jobText} Submitted`, {
            closeButton: true,
            disableTimeOut: true,
          })
          .onTap.subscribe(() => {
            const searchType = models.SearchType.CUSTOM_PRODUCTS;
            this.store$.dispatch(new searchStore.SetSearchType(searchType));
          });

        return undefined;
      } catch (err) {
        console.log(err);
        const message =
          err instanceof HttpErrorResponse
            ? (err.error?.detail ?? err.message)
            : 'Request failed. Please try again.';
        return { kind: 'server', message };
      }
    });
  }
}
