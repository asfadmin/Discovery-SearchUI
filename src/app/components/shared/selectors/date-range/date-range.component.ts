import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import * as moment from 'moment';
import { SubSink } from 'subsink';

import { NgForm } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.scss']
})
export class DateRangeComponent implements OnInit, OnDestroy {
  @ViewChild('dateRangeForm', { static: true }) public dateRangeForm: NgForm;

  @Input() minDate: Date;
  @Input() maxDate: Date;

  @Input() startDate: Date;
  @Input() endDate: Date;

  @Output() newStart = new EventEmitter<Date>();
  @Output() newEnd = new EventEmitter<Date>();

  public startDateErrors$ = new Subject<void>();
  public endDateErrors$ = new Subject<void>();
  public isStartError = false;
  public isEndError = false;

  private subs = new SubSink();

  constructor() { }

  ngOnInit(): void {
    this.handleDateErrors();
  }

  public reset() {
    this.dateRangeForm.reset();
  }

  public onStartDateChange(e: MatDatepickerInputEvent<moment.Moment>): void {

    let date: null | Date;

    if (!this.startControl.valid || !e.value) {
      date = null;
      this.startDateErrors$.next();
    } else {
      const momentDate = e.value.set({h: 0});
      date = this.toJSDate(momentDate);
    }

    this.newStart.emit(date);
  }

  public onEndDateChange(e: MatDatepickerInputEvent<moment.Moment>): void {
    let date: null | Date;

    if (!this.endControl.valid || !e.value) {
      date = null;
      this.endDateErrors$.next();
    } else {
      date = this.endDateFormat(e.value);
    }

    this.newEnd.emit(date);
  }

  private get startControl() {
    return this.dateRangeForm.form
      .controls['startInput'];
  }

  private get endControl() {
    return this.dateRangeForm.form
      .controls['endInput'];
  }

  private endDateFormat(date: Date | moment.Moment) {
    const endDate = moment(date).set({h: 23, m: 59, s: 59});
    return this.toJSDate(endDate);
  }

  private toJSDate(date: moment.Moment) {
    const m = Object.freeze(date);
    return m.toDate();
  }

  private handleDateErrors(): void {
    this.subs.add(
      this.startDateErrors$.pipe(
        tap(_ => {
          this.isStartError = true;
          this.startControl.reset();
          this.startControl.setErrors({'incorrect': true});
        }),
        delay(820),
      ).subscribe(_ => {
        this.isStartError = false;
        this.startControl.setErrors(null);
      })
    );

    this.subs.add(
      this.endDateErrors$.pipe(
        tap(_ => {
          this.isEndError = true;
          this.endControl.reset();
          this.endControl.setErrors({'incorrect': true});
        }),
        delay(820),
      ).subscribe(_ => {
        this.isEndError = false;
        this.endControl.setErrors(null);
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
