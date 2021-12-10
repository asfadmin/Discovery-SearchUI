import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { tap, delay, map } from 'rxjs/operators';
import * as moment from 'moment';
import { SubSink } from 'subsink';
import { FormGroup, FormControl, AbstractControl  } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DateAdapter, NativeDateAdapter } from '@angular/material/core';
import { NotificationService } from '@services';

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
  @Output() startDateError = new EventEmitter<void>();
  @Output() endDateError = new EventEmitter<void>();


  public startDateErrors$ = new Subject<void>();
  public endDateErrors$ = new Subject<void>();
  public invalidDateError$ = new Subject<AbstractControl>();

  public isStartError = false;
  public isEndError = false;

  private subs = new SubSink();

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    if (!!this.startDate && this.startDate !== new Date(undefined)) {
      this.dateRangeForm.patchValue({
        StartDateControl: this.startDate
      });
    }
    if (!!this.endDate) {
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
      if(e.value == null) {
        this.invalidDateError$.next(this.startControl);
      } else {
        this.startDateErrors$.next();
      }
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
      if(e.value == null) {
        this.invalidDateError$.next(this.endControl);
      } else {
        this.endDateErrors$.next();
      }
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
          this.startDateError.emit();
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
          this.endDateError.emit();
        }),
        delay(820),
      ).subscribe(_ => {
        this.isEndError = false;
        this.endControl.setErrors(null);
      })
    );

    this.subs.add(
      this.invalidDateError$.pipe(
        map(targetControl => ({
          key: Object.keys(this.dateRangeForm.controls).find(key => this.dateRangeForm.controls[key] === targetControl),
          targetControl
        })),
        tap(data => {

          const key = data.key;
          const control = data.targetControl;

          if(key === "StartDateControl") {
            this.isStartError = true;
          } else if(key === "EndDateControl") {
            this.isEndError = true;
          }

          control.reset();
          control.setErrors({'incorrect': true});
          // this.endDateError.emit();
        }),
        delay(820),
      ).subscribe(data => {
        if(data.key === "StartDateControl") {
          this.isStartError = false;
        } else if(data.key === "EndDateControl") {
          this.isEndError = false;
        }
        data.targetControl.setErrors(null);
        this.notificationService.error("Not a valid date");
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
