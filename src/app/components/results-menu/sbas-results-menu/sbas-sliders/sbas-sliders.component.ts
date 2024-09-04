import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import * as noUiSlider from 'nouislider';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { AppState } from '@store';
import { Store } from '@ngrx/store';
import * as filtersStore from '@store/filters';

import { SubSink } from 'subsink';
import * as models from "@models";
declare var wNumb: any;

@Component({
  selector: 'app-sbas-sliders',
  templateUrl: './sbas-sliders.component.html',
  styleUrls: ['./sbas-sliders.component.scss']
})
export class SbasSlidersComponent implements OnInit {
  @ViewChild('distanceFilter', { static: true }) temporalFilter: ElementRef;

  public temporalAutoTicks = false;
  public temporalShowTicks = true;
  public temporalTickInterval = 7;

  public distSlider;
  public distanceRange: models.Range<number> = {start: 0, end: 800};

  // private firstLoad = true;
  private lastValue: models.Range<number> = {start: 0, end: 800};
  private subs = new SubSink();

  private lastStartValue: number;
  private lastEndValue: number;

  constructor(
    private store$: Store<AppState>,
  ) { }

  ngOnInit(): void {
    const distanceSlider = this.makeDistanceSlider$(this.temporalFilter);

    this.distSlider = distanceSlider.slider;

    this.subs.add(
      distanceSlider.values$.subscribe(
        ([start, end]) => {
          if (this.lastStartValue !== start || this.lastEndValue !== end){
            console.log('distanceSlider.values$ subscription start, end:', start, end);
            this.lastStartValue = start;
            this.lastEndValue = end;
            const action = new filtersStore.SetPerpendicularRange({ start: start, end: end });
            this.store$.dispatch(action);
          }
        }
      )
    );

    this.subs.add(
      this.store$.select(filtersStore.getPerpendicularRange).subscribe(
        temp => {
          // console.log('getPerpendicularRange subscription temp:', temp);
          this.distanceRange = {start: temp.start, end: temp.end};

          if (this.lastValue !== this.distanceRange) {
            this.distSlider.set([this.distanceRange]);
            this.lastValue = this.distanceRange;
          }
        }
      )
    );
  }

  public getBaselineSliderTickInterval(): number | 'auto' {
    if (this.temporalShowTicks) {
      return this.temporalAutoTicks ? 'auto' : this.temporalTickInterval;
    }

    return 0;
  }

  private makeDistanceSlider$(filterRef: ElementRef) {
    const values$ = new Subject<number[]>();

    const slider = noUiSlider.create(filterRef.nativeElement, {
      orientation: 'vertical',
      direction: 'rtl',
      start: [0, 800],
      behaviour: 'tap-drag',
      tooltips: false,
      connect: true,
      step: 1,
      range: {
        'min': 0,
        'max': 800
      },
      pips: {
        mode: noUiSlider.PipsMode.Positions,
        values: [0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750],
        density: 4,
        stepped: true,
        format: wNumb({
          decimals: 0,
          suffix: ' m'
        })
      }
    });

    slider.on('update', (values, _) => {
      values$.next(values.map(v => +v));
    });

    return {
      slider,
      values$: values$.asObservable().pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      };
  }
}
