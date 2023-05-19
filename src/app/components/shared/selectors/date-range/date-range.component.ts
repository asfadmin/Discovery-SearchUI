import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { tap, delay, map } from 'rxjs/operators';
import * as moment from 'moment';
import { SubSink } from 'subsink';
import { UntypedFormGroup, UntypedFormControl  } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DateAdapter, NativeDateAdapter } from '@angular/material/core';
import { NotificationService } from '@services';
import { AsfLanguageService } from "@services/asf-language.service";

// import {
//   MAT_MOMENT_DATE_FORMATS,
//   MomentDateAdapter,
//   MAT_MOMENT_DATE_ADAPTER_OPTIONS,
// } from '@angular/material-moment-adapter';
// import {MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
// import { MAT_DATE_LOCALE } from '@angular/material/core';

@Component({
  selector: 'app-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: NativeDateAdapter
    },
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    // {provide: MAT_DATE_LOCALE, useValue: 'en'},

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    // {
    //   provide: DateAdapter,
    //   useClass: MomentDateAdapter,
    //   deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    // },
    // {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ]
})
export class DateRangeComponent implements OnInit, OnDestroy {
  public dateRangeForm = new UntypedFormGroup({
    StartDateControl: new UntypedFormControl(),
    EndDateControl: new UntypedFormControl()
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
  public invalidDateError$ = new Subject<UntypedFormControl>();
  public isStartError = false;
  public isEndError = false;
  private subs = new SubSink();

  constructor(
    private notificationService: NotificationService,
    private _adapter: DateAdapter<any>,
    public language: AsfLanguageService,
    // @Inject(MAT_DATE_LOCALE) private _locale: string,
  ) {
    const locale = moment.locale();
    this._adapter.setLocale(locale);
  }

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
    if (!this.startControl.valid || !e.value) {
      if (this.isInvalidDateError(this.startControl)) {
        this.invalidDateError$.next(this.startControl);
      } else {
        this.startDateErrors$.next();
      }

      return;
    }

    const momentDate = moment(new Date(e.value)).set({h: 0});
    const date = this.toJSDate(momentDate);
    this.newStart.emit(date);
  }

  public onEndDateChange(e: MatDatepickerInputEvent<Date>): void {
    if (!this.endControl.valid || !e.value) {
      if (this.isInvalidDateError(this.endControl)) {
        this.invalidDateError$.next(this.endControl);
      } else {
        this.endDateErrors$.next();
      }

      return;
    }

    const date = this.endDateFormat(new Date(e.value));
    this.newEnd.emit(date);
  }

  private isInvalidDateError(control: UntypedFormControl) {
    return !!control.errors?.matDatepickerParse;
  }

  private get startControl() {
    return this.dateRangeForm
      .controls['StartDateControl'] as UntypedFormControl;
  }

  private get endControl() {
    return this.dateRangeForm
      .controls['EndDateControl'] as UntypedFormControl;
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
          this.onSetError(this.startControl);
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
          this.onSetError(this.endControl);
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
        map(control => ({
          name: Object.keys(this.dateRangeForm.controls).find(
            key => this.dateRangeForm.controls[key] === control),
          control
        })),
        tap(({name, control}) => {
          this.notificationService.error('', 'Not a valid date');
          this.onSetErrorState(name, false);
          this.onSetError(control);
        }),
        delay(820),
      ).subscribe(({name, control}) => {
        this.onSetErrorState(name, false);
        control.setErrors(null);
      })
    );
  }

  private onSetError(control: UntypedFormControl) {
    control.reset();
    control.setErrors({'incorrect': true, });
  }

  private onSetErrorState(controlName: string, value: boolean) {
    if (controlName === 'StartDateControl') {
      this.isStartError = value;
    } else if (controlName === 'EndDateControl') {
      this.isEndError = value;
    }
  }

  getDateFormatString(): string {
    const locale = moment.locale();
    // this._adapter.setLocale(locale);
    if (locale === 'en') {
      return 'MM/DD/YYYY';
    } else if (locale === 'es') {
      return 'DD/MM/YYYY';
    }
    return '';
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
