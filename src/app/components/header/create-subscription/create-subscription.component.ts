import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { SubSink } from 'subsink';
import * as moment from 'moment';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

import { combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as hyp3Store from '@store/hyp3';
import * as filtersStore from '@store/filters';

import { ScreenSizeService, MapService, Hyp3Service, EnvironmentService, AsfApiService } from '@services';
import * as models from '@models';

enum CreateSubscriptionSteps {
  SEARCH_OPTIONS = 0,
  PROCESSING_OPTIONS = 1,
  REVIEW = 2
}

@Component({
  selector: 'app-create-subscription',
  templateUrl: './create-subscription.component.html',
  styleUrls: ['./create-subscription.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
  }]
})
export class CreateSubscriptionComponent implements OnInit, OnDestroy {
  @ViewChild('stepper', { static: false }) public stepper: MatStepper;

  public jobTypeId = models.hyp3JobTypes.RTC_GAMMA.id;
  public errors = {
    dateError: null,
    polygonError: null,
    projectNameError: null,
  };

  public hyp3JobTypes = models.hyp3JobTypes;
  public hyp3JobTypesList = models.hyp3JobTypesList;
  public selectedJobTypeId: string | null = models.hyp3JobTypes.RTC_GAMMA.id;

  public productTypes = [{
      apiValue: 'GRD_HD',
      displayName: 'L1 Detected High-Res Dual-Pol (GRD-HD)'
  }, {
      apiValue: 'SLC',
      displayName: 'L1 Single Look Complex (SLC)'
  }];
  public productType = 'SLC';

  public flightDirectionTypes = models.flightDirections;
  public flightDirection;

  public polarizations = [
    'VV+VH',
    'HH+HV',
    'VV',
    'HH',
  ];
  public polarization;

  public s1Subtypes = [{
      displayName: 'Sentinel-1',
      apiValue: 'S1',
    },
    ...models.sentinel_1.subtypes
  ];
  public subtype = 'S1';

  public processingOptionsList = [];
  public processingOptions;

  public dateRange: models.Range<Date | null>;
  public projectName: string;
  public searchFilters;
  public polygon: string;
  public subEstimate: number | null = null;

  public breakpoint: models.Breakpoints;
  public breakpoints = models.Breakpoints;
  public validateOnly = false;

  private subs = new SubSink();

  public searchOptionsFormGroup: FormGroup;
  public reviewFormGroup: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CreateSubscriptionComponent>,
    private screenSize: ScreenSizeService,
    private mapService: MapService,
    private hyp3: Hyp3Service,
    public env: EnvironmentService,
    private asfApi: AsfApiService,
    private store$: Store<AppState>,
    private _formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {

    const end = new Date();
    this.dateRange = {
      start: new Date(),
      end: new Date(end.setDate(end.getDate() + 179)),
    };

    this.searchOptionsFormGroup = this._formBuilder.group({
      dateRange: [1, Validators.max(1)],
      aoi: [1, Validators.max(1)]
    });

    this.reviewFormGroup = this._formBuilder.group({
      projectName: [1, Validators.max(1)]
    });

    this.subs.add(
      this.screenSize.breakpoint$.subscribe(
        breakpoint => this.breakpoint = breakpoint
      )
    );

    this.subs.add(
      this.mapService.searchPolygon$.subscribe(
        polygon => this.polygon = polygon
      )
    );

    this.subs.add(
      this.store$.select(hyp3Store.getProcessingOptions).subscribe(
        options => {
          this.processingOptionsList = Object.entries(options).filter(([_, v]) => v);
          this.processingOptions = options;
        })
    );

    this.subs.add(
      combineLatest(
        this.store$.select(filtersStore.getProductTypes),
        this.store$.select(filtersStore.getSubtypes),
        this.store$.select(filtersStore.getPolarizations),
        this.store$.select(filtersStore.getFlightDirections),
      ).pipe(
        take(1)
      ).subscribe(
        ([productTypes, subtypes, pols, flightDirs]) => {
          console.log(productTypes, subtypes, pols, flightDirs);
        }
      )
    );

    this.subs.add(
      this.store$.select(hyp3Store.getProcessingProjectName).subscribe(
        name => this.projectName = name
      )
    );
  }

  public onSelectionChange(): void {
    this.checkErrors();
  }

  public onNewStartDate(d: Date): void {
    this.dateRange.start = d;

    if (this.dateRange.end < this.dateRange.start && !!this.dateRange.end) {
      this.dateRange.end = d;
    }
  }

  public onNewEndDate(d: Date): void {
    this.dateRange.end = d;

    if (this.dateRange.start > this.dateRange.end && !!this.dateRange.start) {
      this.dateRange.start = d;
    }
  }

  public onNext(): void {
    const hasErrors = this.checkErrors();

    if (hasErrors) {
      return;
    }

    if (this.isLastStep() && this.areNoStepsWithErrors()) {
      this.submitSubscription();
    } else {
      this.stepper.next();
    }
  }

  public checkErrors(): boolean {
    let hasErrors = true;

    if (this.stepper.selectedIndex === CreateSubscriptionSteps.SEARCH_OPTIONS) {
      this.errors.dateError = null;
      this.errors.polygonError = null;

      if (!this.dateRange.start && !this.dateRange.end) {
        this.errors.dateError = 'Start and end date required';
      } else if (!this.dateRange.start) {
        this.errors.dateError = 'Start date required';
      } else if (!this.dateRange.end) {
        this.errors.dateError = 'End date required';
      }

      if (!this.polygon) {
        this.errors.polygonError = 'Area of interest required (will use polygon from current search)';
      }

      if (this.errors.dateError) {
        this.searchOptionsFormGroup.controls['dateRange'].setValue(2);
      } else if (this.errors.polygonError) {
        this.searchOptionsFormGroup.controls['aoi'].setValue(2);
      } else {
        hasErrors = false;
        this.searchOptionsFormGroup.controls['aoi'].setValue(1);
        this.searchOptionsFormGroup.controls['dateRange'].setValue(1);
      }
    } else if (this.stepper.selectedIndex === CreateSubscriptionSteps.PROCESSING_OPTIONS) {
      this.onEstimateSubscription();
      hasErrors = false;
    } else if (this.stepper.selectedIndex === CreateSubscriptionSteps.REVIEW) {
      this.errors.polygonError = null;

      if (!this.projectName) {
        this.errors.projectNameError = 'Project Name is required';
        this.reviewFormGroup.controls['projectName'].setValue(2);
      } else {
        this.reviewFormGroup.controls['projectName'].setValue(1);
        hasErrors = false;
      }
    }

    return hasErrors;
  }

  public isLastStep(): boolean {
    if (!this.stepper) {
      return false;
    }

    return this.stepper.selectedIndex === this.stepper.steps.length - 1;
  }

  public submitSubscription(): void {
    const searchParams = this.getSearchParams();

    const sub = {
      job_specification: {
        job_parameters: {
          ...this.processingOptions
        },
        job_type: 'RTC_GAMMA',
        name: this.projectName
      },
      search_parameters: {
        ...searchParams,
      }
    };

    this.hyp3.submiteSubscription$({
      subscription: sub, validate_only: this.validateOnly
    }).subscribe(_ => {
      this.dialogRef.close();
    });
  }

  public onNewProductType(e): void {
    this.productType = e.value;
  }

  public onNewFlightDirection(e): void {
    this.flightDirection = e.value;
  }

  public onNewPolarization(e): void {
    this.polarization = e.value;
  }

  public onNewSubType(e): void {
    this.subtype = e.value;
  }

  public onNewJobType(e): void {
    this.jobTypeId = e.value;
  }

  public onBack(): void {
    this.stepper.previous();
  }

  public showSearchAreaType(polygon: string): string {
    return polygon.split('(')[0];
  }

  public onValidateOnlyToggle(val: boolean): void {
    this.validateOnly = val;
  }

  public filterOptions(optionList, jobTypeId) {
    const jobType = models.hyp3JobTypes[jobTypeId];
    const allOptions = !!jobType ? jobType.options : models.hyp3JobOptionsOrdered;

    const options = optionList.reduce((total, op) => {
      total[op[0]] = op[1];
      return total;
    }, {});

    const filtered = allOptions
      .filter(option => options[option.apiName])
      .map(option => {
        return {name: option.name, val: options[option.apiName]};
      });

    return filtered;
  }

  public onEstimateSubscription(): void {
    const start = new Date();
    const dateRange = {
      start: new Date(start.setDate(start.getDate() - 179)),
      end: new Date(),
    };

    const params = this.filterNullKeys({
      start: moment.utc(dateRange.start).format(),
      end: moment.utc(dateRange.end).format(),
      intersectsWith: this.polygon,
      platform: this.subtype,
      flightDirection: !!this.flightDirection ? this.flightDirection.toUpperCase() : null,
      polarization: !!this.polarization ? [ this.polarization ] : null,
      processinglevel: this.productType,
      output: 'COUNT',
    });

    this.subs.add(
      this.asfApi.query(params).subscribe(
        estimate => this.subEstimate = Math.round(<number>estimate / 6)
      )
    );
  }

  private getSearchParams() {
    const params = {
      start: moment.utc(this.dateRange.start).format(),
      end: moment.utc(this.dateRange.end).format(),
      intersectsWith: this.polygon,
      platform: this.subtype,
      flightDirection: !!this.flightDirection ? this.flightDirection.toUpperCase() : null,
      polarization: !!this.polarization ? [ this.polarization ] : null,
      processingLevel: this.productType,
    };

    return this.filterNullKeys(params);
  }

  public isDevMode(): boolean {
    return !this.env.isProd;
  }

  private filterNullKeys(params) {
    return Object.keys(params)
      .filter((k) => params[k] != null)
      .reduce((a, k) => ({ ...a, [k]: params[k] }), {});
  }

  public onCloseDialog() {
    this.dialogRef.close();
  }

  private areNoStepsWithErrors() {
    return (
      this.errors.dateError === null &&
      this.errors.polygonError === null &&
      this.errors.projectNameError === null
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
