import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import * as moment from 'moment';
import { SubSink } from 'subsink';
import { FormGroup, FormControl  } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DateAdapter, NativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.scss'],
  providers: [{
    provide: DateAdapter,
    useClass: NativeDateAdapter
  }]
})
export class DateRangeComponent implements OnInit, OnDestroy {
  public dateRangeForm = new FormGroup({
    StartDateControl: new FormControl(),
    EndDateControl: new FormControl()
  });

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
    if(!!this.startDate && this.startDate != new Date(undefined)) {
      this.dateRangeForm.patchValue({
        StartDateControl: this.startDate
      });
    }
    if(!!this.endDate) {
      this.dateRangeForm.patchValue({
        EndDateControl: this.endDate
      });
    }

    this.handleDateErrors();
  }

  public reset() {
    this.dateRangeForm.reset();
  }

  public onStartDateChange(e: MatDatepickerInputEvent<Date>): void {

    let date: null | Date;

    if (!this.startControl.valid || !e.value) {
      date = null;
      this.startDateErrors$.next();
    } else {
      const momentDate = moment(new Date(e.value)).set({h: 0});
      date = this.toJSDate(momentDate);
    }

    this.newStart.emit(date);
  }

  public onEndDateChange(e: MatDatepickerInputEvent<Date>): void {
    let date: null | Date;

    if (!this.endControl.valid || !e.value) {
      date = null;
      this.endDateErrors$.next();
    } else {
      date = this.endDateFormat(new Date(e.value));
    }

    this.newEnd.emit(date);
  }

  private get startControl() {
    return this.dateRangeForm
      .controls['StartDateControl'];
  }

  private get endControl() {
    return this.dateRangeForm
      .controls['EndDateControl'];
  }

  private endDateFormat(date: Date) {
    const endDate = moment(new Date(date)).set({h: 23, m: 59, s: 59});
    return this.toJSDate(endDate);
  }

  private toJSDate(date: moment.Moment) {
    return new Date(date.toDate());
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
