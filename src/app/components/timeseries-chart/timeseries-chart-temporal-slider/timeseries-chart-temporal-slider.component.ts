import {Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import * as noUiSlider from 'nouislider';
import { Store } from "@ngrx/store";
import { AppState } from "@store";
import * as models from "@models";
import {Observable, Subject} from 'rxjs';
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import * as filtersStore from "@store/filters";
import {SubSink} from "subsink";
import {debounceTime, distinctUntilChanged} from "rxjs/operators";
import wNumb from 'wnumb';

@Component({
  selector: 'app-timeseries-chart-temporal-slider',
  standalone: true,
  templateUrl: './timeseries-chart-temporal-slider.component.html',
  styleUrls: ['./timeseries-chart-temporal-slider.component.scss']
})
export class TimeseriesChartTemporalSliderComponent implements OnInit {
  @ViewChild('slider', { static: true }) sliderRef: ElementRef;

  public daysRange: models.Range<number> = {start: 0, end: 0};
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
          console.log('temporal chart slider temporal range', temp);
          // this.slider.set.range({min: temp.start, max: temp.end});
          if (this.firstLoad) {
            this.firstLoad = false;
          //   this.slider.set([temp.start, temp.end]);
          }
        }
      )
    );
  }

  updateDaysOffset() {
    this.options.controls.days.setValue(this.daysRange);
    this.daysValues$.next([this.daysRange.start, this.daysRange.end] );
  }

  public makeDaysSlider(filterRef: ElementRef): {slider: any, daysValues: Observable<number[]>} {
    console.log('makeDaysSlider daysRange', this.daysRange);
    this.slider = noUiSlider.create(filterRef.nativeElement, {
      start: [1995, 2025],
      behaviour: 'tap-drag',
      tooltips: false,
      connect: true,
      // Steps of one week
      step: 7 * 24 * 60 * 60 * 1000,
      range: {
        'min': 1995,
        'max': 2025
      },
      // No decimals
      format: wNumb({
        decimals: 0
      })
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
