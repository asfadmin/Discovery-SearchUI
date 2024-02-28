import {Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { tap, delay, map } from 'rxjs/operators';
import moment from 'moment';
import { SubSink } from 'subsink';
import { UntypedFormGroup, UntypedFormControl  } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DateAdapter } from '@angular/material/core';
import { NotificationService, ScreenSizeService } from '@services';
import {Store} from "@ngrx/store";
import {AppState} from "@store";
import * as uiStore from '@store/ui';
import * as models from '@models';

@Component({
  selector: 'app-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.scss'],
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

  public breakpoint: models.Breakpoints;
  public breakpoints = models.Breakpoints;

  constructor(
    private notificationService: NotificationService,
    private dateAdapter: DateAdapter<any>,
    private screenSize: ScreenSizeService,
    private store$: Store<AppState>,
  ) {}

  ngOnInit(): void {

    this.subs.add(
      this.store$.select(uiStore.getCurrentLanguage).subscribe(
        currentLanguage => {
          this.setCalLang(currentLanguage);
        }
      )
    );

    this.screenSize.breakpoint$.subscribe(
      breakpoint => this.breakpoint = breakpoint
    );

    this.dateAdapter.setLocale(moment.locale());

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
    this.dateAdapter.setLocale(moment.locale());
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
    this.dateAdapter.setLocale(moment.locale());
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
    if (locale === 'en') {
      return 'MM/DD/YYYY';
    } else if (locale === 'es') {
      return 'DD/MM/YYYY';
    }
    return '';
  }

  setCalLang(language) {
    if (!language) {
      this.dateAdapter.setLocale('en');
    } else {
      this.dateAdapter.setLocale(language);
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
