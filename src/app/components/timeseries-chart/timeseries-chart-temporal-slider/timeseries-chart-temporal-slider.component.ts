import {Component, ElementRef, ViewChild, OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';
import * as noUiSlider from 'nouislider';
import { Store } from "@ngrx/store";
import { AppState } from "@store";
import * as models from "@models";
import {Subject} from 'rxjs';
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
export class TimeseriesChartTemporalSliderComponent implements OnInit, OnChanges {
  @Input() maxRange: models.Range<number> = {start: 0, end: 0};
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes.maxRange && changes.maxRange.currentValue) {
      console.log('changes.maxRange', changes.maxRange.currentValue);
      this.maxRange = changes.maxRange.currentValue;
      this.slider.noUiSlider.updateOptions({
        start: [this.maxRange.start.valueOf(), this.maxRange.end.valueOf()],
        range: {
          'min': this.maxRange.start.valueOf(),
          'max': this.maxRange.end.valueOf()
        }
      });
    }
  }

  public makeDaysSlider(filterRef: ElementRef) {
    console.log('makeDaysSlider maxRange', this.maxRange);
    this.slider = noUiSlider.create(filterRef.nativeElement, {
      start: [2000, 2023],
      connect: true,
      step: 1,
      range: {
        'min': 2000,
        'max': 2023
      }
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
