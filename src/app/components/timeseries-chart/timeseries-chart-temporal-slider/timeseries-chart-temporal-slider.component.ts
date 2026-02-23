import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  Renderer2,
  inject,
} from '@angular/core';
import * as noUiSlider from 'nouislider';
import { PipsMode } from 'nouislider';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
// import * as models from "@models";
// import {Observable, Subject} from 'rxjs';
// import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
// import * as filtersStore from "@store/filters";
import { SubSink } from 'subsink';
// import {debounceTime, distinctUntilChanged} from "rxjs/operators";
// import wNumb from 'wnumb';
import * as filtersStore from '@store/filters';
import * as models from '@models';
// import moment from 'moment/moment';
import { Observable, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  withLatestFrom,
} from 'rxjs/operators';

// import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

@Component({
  selector: 'app-timeseries-chart-temporal-slider',
  standalone: true,
  templateUrl: './timeseries-chart-temporal-slider.component.html',
  styleUrls: ['./timeseries-chart-temporal-slider.component.scss'],
})
export class TimeseriesChartTemporalSliderComponent
  implements OnInit, OnDestroy
{
  private store$ = inject<Store<AppState>>(Store);
  private renderer = inject(Renderer2);

  @ViewChild('ts_slider', { static: true }) sliderRef: ElementRef;

  private subs = new SubSink();

  public tsSlider: noUiSlider.API;
  public timeSeriesSlider: any;
  public maxRange: models.Range<any> = { start: 0, end: 100 };
  public lastMaxRange: models.Range<any> = { start: 0, end: 100 };
  public selectedRange: models.Range<any> = { start: 0, end: 100 };
  public startDate$ = this.store$.select(filtersStore.getStartDate);
  public endDate$ = this.store$.select(filtersStore.getEndDate);
  public startDate: Date = new Date();
  public endDate: Date = new Date();

  ngOnInit() {
    this.timeSeriesSlider = this.makeTimeSeriesSlider(this.sliderRef);
    this.tsSlider = this.timeSeriesSlider.slider;

    this.subs.add(
      this.store$
        .select(filtersStore.getTemporalRange)
        .pipe(withLatestFrom(this.store$.select(filtersStore.getDateRange)))
        .subscribe(([temp, _dateRange]) => {
          if (
            !temp.start ||
            !temp.end ||
            Number.isNaN(temp.start.valueOf()) ||
            Number.isNaN(temp.end.valueOf())
          ) {
            return;
          }
          this.maxRange = {
            start: temp.start.valueOf(),
            end: temp.end.valueOf(),
          };
          if (
            this.lastMaxRange.start > this.maxRange.start ||
            this.lastMaxRange.end < this.maxRange.end
          ) {
            this.lastMaxRange.start = this.maxRange.start;
            this.lastMaxRange.end = this.maxRange.end;
            this.sliderRef.nativeElement.noUiSlider.updateOptions({
              range: {
                min: this.maxRange.start,
                max: this.maxRange.end,
              },
            });

            const action = new filtersStore.SetStartDate(
              new Date(this.maxRange.start),
            );
            this.store$.dispatch(action);
            const action2 = new filtersStore.SetEndDate(
              new Date(this.maxRange.end),
            );
            this.store$.dispatch(action2);

            // if (!this.userChangedRange) {
            this.sliderRef.nativeElement.noUiSlider.updateOptions({
              start: [this.maxRange.start, this.maxRange.end],
            });
            this.renderer.setStyle(
              this.sliderRef.nativeElement,
              'visibility',
              'visible',
            );
          }
        }),
    );

    this.subs.add(
      this.timeSeriesSlider.values$.subscribe(([start, end]) => {
        if (!start || !end) {
          return;
        }
        if (
          start === this.selectedRange.start &&
          end === this.selectedRange.end
        ) {
          return;
        }
        this.selectedRange = { start: start, end: end };
        this.sliderRef.nativeElement.noUiSlider.updateOptions({
          start: [this.selectedRange.start, this.selectedRange.end],
        });
        // this.userChangedRange = true;
        const action = new filtersStore.SetStartDate(new Date(start));
        this.store$.dispatch(action);
        const action2 = new filtersStore.SetEndDate(new Date(end));
        this.store$.dispatch(action2);
      }),
    );
  }

  private timestamp(str) {
    return new Date(str).getTime();
  }

  // Create a string representation of the date.
  public formatDate(date: any): string {
    const fDateStr = date.toLocaleDateString();
    return fDateStr;
  }

  public toFormat(value: any) {
    if (value == 0) return 0;
    return new Date(value).toLocaleDateString();
  }

  public makeTimeSeriesSlider(filterRef: ElementRef): {
    slider: noUiSlider.API;
    values$: Observable<number[]>;
  } {
    const self = this;
    const values$ = new Subject<number[]>();
    // Steps of one day
    const increment = 24 * 60 * 60 * 1000;
    const slider = noUiSlider.create(filterRef.nativeElement, {
      start: [1, 100],
      behaviour: 'tap-drag',
      tooltips: [
        { to: (d) => self.toFormat(d) },
        { to: (d) => self.toFormat(d) },
      ],
      connect: true,
      step: increment,
      range: {
        min: 1,
        max: 100,
      },
      pips: {
        mode: PipsMode.Count,
        values: 5,
        stepped: true,
        density: 4,
        format: {
          from: (value) => {
            return self.timestamp(value);
          },
          to: self.toFormat,
        },
      },
    });

    slider.on('update', (values: any[], _: any) => {
      values$.next(values.map((v) => +v));
    });

    return {
      slider,
      values$: values$
        .asObservable()
        .pipe(debounceTime(500), distinctUntilChanged()),
    };
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
