// Perpendicular baseline slider component
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import * as noUiSlider from 'nouislider';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { AppState } from '@store';
import { Store } from '@ngrx/store';
import * as filtersStore from '@store/filters';

import { SubSink } from 'subsink';
import * as models from '@models';
declare var wNumb: any;

@Component({
  selector: 'app-sbas-sliders',
  templateUrl: './sbas-sliders.component.html',
  styleUrls: ['./sbas-sliders.component.scss']
})
export class SbasSlidersComponent implements OnInit {
  @ViewChild('perpendicularFilter', { static: true }) perpendicularFilter: ElementRef;

  // public temporalAutoTicks = false;
  // public temporalShowTicks = true;
  // public temporalTickInterval = 7;

  public perpendicularSlider: any;
  public perpRange: models.Range<number>;
  public temporal: number;

  // private firstLoad = true;
  private lastRange: models.Range<number> = { start: 0, end: 800 };
  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
  ) { }

  ngOnInit(): void {
    const baselineSlider = this.makeBaselineSlider$(this.perpendicularFilter);

    this.perpendicularSlider = baselineSlider.slider;

    this.subs.add(
      baselineSlider.values$.subscribe(
        ([start, end]) => {
          if (start === this.perpRange.start && end === this.perpRange.end) {
            return;
          }
          const action = new filtersStore.SetPerpendicularRange({ start, end });
          this.store$.dispatch(action);
        }
      )
    );

    this.subs.add(
      this.store$.select(filtersStore.getPerpendicularRange).subscribe(
        perp => {
          this.perpRange = perp;
          if (this.lastRange !== this.perpRange) {
            this.lastRange = this.perpRange;
            this.perpendicularSlider.set([perp.start, perp.end]);
          }
        }
      )
    );
  }

  // public getBaselineSliderTickInterval(): number | 'auto' {
  //   if (this.temporalShowTicks) {
  //     return this.temporalAutoTicks ? 'auto' : this.temporalTickInterval;
  //   }
  //
  //   return 0;
  // }

  private makeBaselineSlider$(filterRef: ElementRef) {
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
