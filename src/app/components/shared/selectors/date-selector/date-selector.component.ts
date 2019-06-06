import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { NgForm } from '@angular/forms';

import { Observable, combineLatest } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Store, ActionsSubject } from '@ngrx/store';

import { AppState } from '@store';
import * as filtersStore from '@store/filters';

import { Platform, DateRangeExtrema } from '@models';
import { DateExtremaService } from '@services';

@Component({
  selector: 'app-date-selector',
  templateUrl: './date-selector.component.html',
  styleUrls: ['./date-selector.component.scss']
})
export class DateSelectorComponent implements OnInit {
  @ViewChild('dateForm', { static: true }) public dateForm: NgForm;

  public extrema: DateRangeExtrema;
  public startDate: Date;
  public endDate: Date;

  public isSeasonalSearch = false;

  public platforms$ = this.store$.select(filtersStore.getPlatformsList);
  public startDate$ = this.store$.select(filtersStore.getStartDate);
  public endDate$ = this.store$.select(filtersStore.getEndDate);
  public seasonStart$ = this.store$.select(filtersStore.getSeasonStart);
  public seasonEnd$ = this.store$.select(filtersStore.getSeasonEnd);
  public selectedPlatforms$ = this.store$.select(filtersStore.getSelectedPlatforms);

  public dateRangeExtrema$ = this.dateExtremaService.getExtrema$(
    this.platforms$,
    this.selectedPlatforms$,
    this.startDate$,
    this.endDate$,
  );

  constructor(
    private store$: Store<AppState>,
    private actions$: ActionsSubject,
    private dateExtremaService: DateExtremaService,
  ) { }

  ngOnInit() {
    this.actions$.pipe(
      filter(action => action.type === filtersStore.FiltersActionType.CLEAR_FILTERS)
    ).subscribe(_ => this.dateForm.reset());

    this.dateRangeExtrema$.subscribe(
      extrema => this.extrema = extrema
    );

    this.startDate$.subscribe(start => this.startDate = start);
    this.endDate$.subscribe(end => this.endDate = end);

    combineLatest(this.seasonStart$, this.seasonEnd$).subscribe(
      ([start, end]) => this.isSeasonalSearch = !!(start || end)
    );
  }

  public onToggleSeasonalOptions(): void {
    this.store$.dispatch(new filtersStore.ClearSeason());
  }

  public onStartDateChange(e: MatDatepickerInputEvent<Date>) {
    this.store$.dispatch(new filtersStore.SetStartDate(e.value));
  }

  public onEndDateChange(e: MatDatepickerInputEvent<Date>) {
    this.store$.dispatch(new filtersStore.SetEndDate(e.value));
  }

  public onSeasonStartChange(dayOfYear: number): void {
    this.store$.dispatch(new filtersStore.SetSeasonStart(dayOfYear));
  }

  public onSeasonEndChange(dayOfYear: number): void {
    this.store$.dispatch(new filtersStore.SetSeasonEnd(dayOfYear));
  }

  public dayOfYearFormat(dayOfYear: number | null): string {
    const date = new Date();
    date.setFullYear(2019);

    date.setMonth(0);
    date.setDate(0);
    const timeOfFirst = date.getTime(); // this is the time in milliseconds of 1/1/YYYY
    const dayMilli = 1000 * 60 * 60 * 24;
    const dayNumMilli = dayOfYear * dayMilli;
    date.setTime(timeOfFirst + dayNumMilli);

    return  date.toLocaleDateString('en-US', {
      month: 'numeric', day: 'numeric'
    });
  }
}
