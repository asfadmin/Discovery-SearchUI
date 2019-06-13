import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { NgForm } from '@angular/forms';

import { filter } from 'rxjs/operators';
import { Store, ActionsSubject } from '@ngrx/store';

import { AppState } from '@store';
import * as filtersStore from '@store/filters';

import { DateRangeExtrema } from '@models';
import { DateExtremaService } from '@services';

@Component({
  selector: 'app-date-selector',
  templateUrl: './date-selector.component.html',
  styleUrls: ['./date-selector.component.scss']
})
export class DateSelectorComponent implements OnInit {
  @ViewChild('dateForm', { static: true }) public dateForm: NgForm;

  public extrema: DateRangeExtrema;

  public startDate$ = this.store$.select(filtersStore.getStartDate);
  public endDate$ = this.store$.select(filtersStore.getEndDate);
  public startDate: Date;
  public endDate: Date;

  constructor(
    private store$: Store<AppState>,
    private actions$: ActionsSubject,
    private dateExtremaService: DateExtremaService,
  ) { }

  ngOnInit() {
    this.actions$.pipe(
      filter(action => action.type === filtersStore.FiltersActionType.CLEAR_FILTERS)
    ).subscribe(_ => this.dateForm.reset());

    this.dateExtremaService.getExtrema$(
      this.store$.select(filtersStore.getPlatformsList),
      this.store$.select(filtersStore.getSelectedPlatforms),
      this.startDate$,
      this.endDate$,
    ).subscribe(
      extrema => this.extrema = extrema
    );

    this.startDate$.subscribe(start => this.startDate = start);
    this.endDate$.subscribe(end => this.endDate = end);
  }

  public onStartDateChange(e: MatDatepickerInputEvent<Date>) {
    this.store$.dispatch(new filtersStore.SetStartDate(e.value));
  }

  public onEndDateChange(e: MatDatepickerInputEvent<Date>) {
    this.store$.dispatch(new filtersStore.SetEndDate(e.value));
  }
}
