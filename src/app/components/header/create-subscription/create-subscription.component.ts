import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { SubSink } from 'subsink';
import * as moment from 'moment';

import { combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as hyp3Store from '@store/hyp3';
import * as filtersStore from '@store/filters';

import { ScreenSizeService, MapService, Hyp3Service, EnvironmentService } from '@services';
import * as models from '@models';

@Component({
  selector: 'app-create-subscription',
  templateUrl: './create-subscription.component.html',
  styleUrls: ['./create-subscription.component.scss']
})
export class CreateSubscriptionComponent implements OnInit, OnDestroy {
  @ViewChild('stepper', { static: false }) public stepper: MatStepper;

  public jobTypeId = models.hyp3JobTypes.RTC_GAMMA.id;

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
  public productType;

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
  public subtype;

  public processingOptionsList = [];
  public processingOptions;

  public dateRange: models.Range<Date | null>;
  public projectName: string;
  public searchFilters;
  public polygon: string;

  public breakpoint: models.Breakpoints;
  public breakpoints = models.Breakpoints;
  public validateOnly = false;

  private subs = new SubSink();

  constructor(
    public dialogRef: MatDialogRef<CreateSubscriptionComponent>,
    private screenSize: ScreenSizeService,
    private mapService: MapService,
    private hyp3: Hyp3Service,
    public env: EnvironmentService,
    private store$: Store<AppState>,
  ) { }

  ngOnInit(): void {
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
      this.store$.select(filtersStore.getDateRange).subscribe(
        range => this.dateRange = range
      )
    );

    this.subs.add(
      this.store$.select(hyp3Store.getProcessingProjectName).subscribe(
        name => this.projectName = name
      )
    );
  }

  public onNext(): void {
    if (this.isLastStep()) {
      this.submitSubscription();
    }

    this.stepper.next();
  }

  private submitSubscription(): void {
    const sub = {
      job_specification: {
        job_parameters: {
          ...this.processingOptions
        },
        job_type: 'RTC_GAMMA',
        name: this.projectName
      },
      search_parameters: {
        start: moment.utc(this.dateRange.start).format(),
        end: moment.utc(this.dateRange.end).format(),
        intersectsWith: this.polygon,
        platform: 'S1',
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

  public isLastStep(): boolean {
    if (!this.stepper) {
      return false;
    }

    return this.stepper.selectedIndex === this.stepper.steps.length - 1;
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

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
