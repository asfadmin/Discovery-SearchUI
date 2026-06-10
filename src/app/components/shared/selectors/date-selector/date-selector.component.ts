import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  Input,
  inject,
} from '@angular/core';
import moment from 'moment';

import { combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { SubSink } from 'subsink';

import { Store, ActionsSubject } from '@ngrx/store';
import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import * as filtersStore from '@store/filters';
import * as searchStore from '@store/search';

import { DateRangeExtrema, SearchType } from '@models';
import { DateExtremaService } from '@services';
import { DateRangeComponent } from '../date-range/date-range.component';
import { AsyncPipe } from '@angular/common';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';

@Component({
  selector: 'app-date-selector',
  templateUrl: './date-selector.component.html',
  styleUrls: ['./date-selector.component.scss'],
  imports: [DateRangeComponent, AsyncPipe],
  providers: [
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ],
})
export class DateSelectorComponent implements OnInit, OnDestroy {
  private store$ = inject<Store<AppState>>(Store);
  private actions$ = inject(ActionsSubject);
  private dateExtremaService = inject(DateExtremaService);

  @ViewChild('dateRange', { static: true }) public dateRange;
  @Input() public extendEndDateBy: number;

  public extrema: DateRangeExtrema;

  private currentDate = new Date();
  private selectedDataset$ = this.store$.select(
    filtersStore.getSelectedDataset,
  );
  public maxDate$ = this.selectedDataset$.pipe(
    map((dataset) => dataset.date.end),
    map((endDate) => {
      const date = endDate <= this.currentDate ? endDate : this.currentDate;

      if (this.extendEndDateBy && !!date) {
        const d = new Date(date.valueOf());
        return new Date(d.setMonth(d.getMonth() + this.extendEndDateBy));
      }

      return date;
    }),
  );

  public minDate$ = this.selectedDataset$.pipe(
    map((dataset) => {
      return dataset.date.start;
    }),
  );
  public startDate$ = this.store$.select(filtersStore.getStartDate);
  public endDate$ = this.store$.select(filtersStore.getEndDate);
  public startDate: Date = new Date();
  public endDate: Date = new Date();

  private subs = new SubSink();

  ngOnInit() {
    this.subs.add(
      this.actions$
        .pipe(
          filter(
            (action) =>
              action.type ===
              filtersStore.FiltersActionType.CLEAR_DATASET_FILTERS,
          ),
        )
        .subscribe((_) => this.dateRange.reset()),
    );

    const dateExtrema$ = this.dateExtremaService.getExtrema$(
      this.store$.select(filtersStore.getSelectedDataset),
      this.startDate$,
      this.endDate$,
    );
    const baselineDateExtrema$ = this.dateExtremaService.getBaselineExtrema$(
      this.store$.select(scenesStore.getScenes),
      this.startDate$,
      this.endDate$,
    );

    this.subs.add(
      combineLatest([
        this.store$.select(searchStore.getSearchType),
        dateExtrema$,
        baselineDateExtrema$,
      ]).subscribe(([searchType, extrema, baselineExtrema]) => {
        if (searchType === SearchType.DATASET) {
          this.extrema = extrema;
        } else if (searchType === SearchType.CUSTOM_PRODUCTS) {
          this.extrema = {
            start: {
              min: null,
              max: null,
            },
            end: {
              min: null,
              max: null,
            },
          };
        } else {
          this.extrema = baselineExtrema;
        }

        if (this.extendEndDateBy && extrema.end.max !== null) {
          const endMax = extrema.end.max;
          const d = new Date(endMax.valueOf());
          d.setDate(d.getDate() + this.extendEndDateBy);

          extrema.end.max = d;
        }
      }),
    );

    this.subs.add(
      this.startDate$.subscribe((start) => {
        this.startDate = start;
        if (this.endDate < this.startDate && !!this.endDate) {
          const endOfDay = this.endDateFormat(this.startDate);
          this.store$.dispatch(new filtersStore.SetEndDate(endOfDay));
        }
      }),
    );

    this.subs.add(
      this.endDate$.subscribe((end) => {
        this.endDate = end;
        if (
          this.startDate > this.endDate &&
          !!this.startDate &&
          !!this.endDate
        ) {
          this.store$.dispatch(new filtersStore.SetStartDate(this.endDate));
        }
      }),
    );
  }

  public onStartDateChange(date): void {
    this.store$.dispatch(new filtersStore.SetStartDate(date));
  }

  public onEndDateChange(date): void {
    this.store$.dispatch(new filtersStore.SetEndDate(date));
  }

  private endDateFormat(date: Date | moment.Moment) {
    const endDate = moment(date).utc().endOf('day');
    return this.toJSDate(endDate);
  }

  public onStartDateError() {
    this.onStartDateChange(null);
  }

  public onEndDateError() {
    this.onEndDateChange(null);
  }

  private toJSDate(date: moment.Moment) {
    return date.toDate();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
