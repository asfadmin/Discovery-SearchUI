import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import noUiSlider from 'nouislider';
import { Subject, Observable } from 'rxjs';
import { delay, debounceTime, distinctUntilChanged, take, filter, map } from 'rxjs/operators';

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
    const [tempSlider, tempValues$] = this.makeTemporalSlider$(this.temporalFilter);
    this.tempSlider = tempSlider;

    this.subs.add(
      tempValues$.subscribe(
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

  public getTemporalSliderTickInterval(): number | 'auto' {
    if (this.temporalShowTicks) {
      return this.temporalAutoTicks ? 'auto' : this.temporalTickInterval;
    }

    return 0;
  }

  private makeTemporalSlider$(filterRef: ElementRef) {
    const values$ = new Subject<number[]>();
    // @ts-ignore
    const slider = noUiSlider.create(filterRef.nativeElement, {
      orientation: 'vertical',
      direction: 'rtl',
      start: [300],
      behaviour: 'tap-drag',
      tooltips: false,
      step: 1,
      range: {
        'min': 0,
        'max': 300
      },
      pips: {
        mode: 'positions',
        values: [0, 50, 100, 150, 200, 250],
        density: 4,
        stepped: true,
        format: wNumb({
          decimals: 0,
          suffix: ' m'
        })
      }
    });

    slider.on('update', (values, handle) => {
      values$.next(values.map(v => +v));
    });

    return [
      slider,
      values$.asObservable().pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
    ];
  }
}
