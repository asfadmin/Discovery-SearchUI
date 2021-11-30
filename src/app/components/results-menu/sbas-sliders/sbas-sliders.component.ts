import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import * as noUiSlider from 'nouislider';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { AppState } from '@store';
import { Store } from '@ngrx/store';
import * as filtersStore from '@store/filters';

import { SubSink } from 'subsink';
declare var wNumb: any;

@Component({
  selector: 'app-sbas-sliders',
  templateUrl: './sbas-sliders.component.html',
  styleUrls: ['./sbas-sliders.component.scss']
})
export class SbasSlidersComponent implements OnInit {
  @ViewChild('temporalFilter', { static: true }) temporalFilter: ElementRef;

  public temporalAutoTicks = false;
  public temporalShowTicks = true;
  public temporalTickInterval = 7;

  public tempSlider;
  public temporal: number;

  private firstLoad = true;
  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
  ) { }

  ngOnInit(): void {
    const baselineSlider = this.makeBaselineSlider$(this.temporalFilter);

    this.tempSlider = baselineSlider.slider;

    this.subs.add(
      baselineSlider.values$.subscribe(
        ([start]) => {
          const action = new filtersStore.SetPerpendicularRange({ start, end: null });
          this.store$.dispatch(action);
        }
      )
    );

    this.subs.add(
      this.store$.select(filtersStore.getPerpendicularRange).subscribe(
        temp => {
          this.temporal = temp.start;

          if (this.firstLoad) {
            this.tempSlider.set([this.temporal]);
            this.firstLoad = false;
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

  private makeBaselineSlider$(filterRef: ElementRef) {
    const values$ = new Subject<number[]>();

    const slider = noUiSlider.create(filterRef.nativeElement, {
      orientation: 'vertical',
      direction: 'rtl',
      start: [300],
      behaviour: 'tap-drag',
      tooltips: false,
      connect: 'lower',
      step: 1,
      range: {
        'min': 0,
        'max': 300
      },
      pips: {
        mode: noUiSlider.PipsMode.Positions,
        values: [0, 50, 100, 150, 200, 250],
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
