import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import * as noUiSlider from 'nouislider';
import { Store } from "@ngrx/store";
import { AppState } from "@store";
import * as models from "@models";
import {Subject} from "rxjs";
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import * as filtersStore from "@store/filters";
import {SubSink} from "subsink";
import {debounceTime, distinctUntilChanged} from "rxjs/operators";

@Component({
  selector: 'app-timeseries-chart-temporal-slider',
  standalone: true,
  templateUrl: './timeseries-chart-temporal-slider.component.html',
  styleUrls: ['./timeseries-chart-temporal-slider.component.scss']
})
export class TimeseriesChartTemporalSliderComponent implements OnInit {
  @ViewChild('slider', { static: true }) sliderRef: ElementRef;

  public daysRange: models.Range<number> = {start: 1, end: 48};
  public lastRange: models.Range<number> = {start: 0, end: 0};
  public daysValues$ = new Subject<number[]>();
  public slider;

  options: UntypedFormGroup;

  daysControl: UntypedFormControl;

  private firstLoad = true;
  private subs = new SubSink();
  constructor(
    private store$: Store<AppState>,
    fb: UntypedFormBuilder
  ) {
    this.daysControl = new UntypedFormControl(this.daysRange, Validators.min(0));

    this.options = fb.group({
      days: this.daysControl,
    });
  }

  ngOnInit() {
    this.daysControl = new UntypedFormControl(this.daysRange, Validators.min(0));
    const daysSliderRef = this.makeDaysSlider(this.sliderRef);
    // const tempSlider = daysSliderRef.slider;
    const daysValues$ = daysSliderRef.daysValues;

    // this.tempSlider = tempSlider;

    this.subs.add(
      daysValues$.subscribe(
        range => {
          console.log(range);
          const action = new filtersStore.SetTemporalRange({ start: range[0], end: range[1] });
          this.store$.dispatch(action);
        }
      )
    );

    this.subs.add(
      this.store$.select(filtersStore.getTemporalRange).subscribe(
        temp => {
          this.daysRange = {start: temp.start, end: temp.end};
          if (this.firstLoad) {
            this.firstLoad = false;
            this.slider.set([temp.start, temp.end]);
          }
        }
      )
    );
  }

  public makeDaysSlider(filterRef: ElementRef) {
    this.slider = noUiSlider.create(filterRef.nativeElement, {
      start: [2000, 2023], // Rango inicial con fechas
      connect: true,
      step: 1,
      tooltips: {
        to: function (value) {
          return Math.round(value).toString(); // Muestra solo el año
        }
      },
      range: {
        min: timestamp('2016-01-01'), // January 1st, 2016
        max: timestamp('2017-12-31') // December 31st, 2017
      },
      step: 24 * 60 * 60 * 1000, // 1 day in milliseconds
      start: [timestamp('2016-06-01'), timestamp('2017-03-01')], // Initial range: June 1st, 2016 to March 1st, 2017
      connect: true // Connect the handle
      behaviour: 'tap-drag',
      orientation: 'horizontal'
    });

    this.slider.on('update', (values, _) => {
      this.daysValues$.next(values.map(v => +v));
    });

    return {
      slider: this.slider,
      daysValues: this.daysValues$.asObservable().pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
    };

  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
