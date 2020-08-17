import {Component, OnInit, ViewChild, ElementRef, Input} from '@angular/core';

import noUiSlider from 'nouislider';
import { Subject, Observable } from 'rxjs';
import { delay, debounceTime, distinctUntilChanged, take, filter, map } from 'rxjs/operators';

import { AppState } from '@store';
import { Store } from '@ngrx/store';
import * as filtersStore from '@store/filters';

import { SubSink } from 'subsink';
import { ScreenSizeService } from '@services';
import * as models from '@models';

declare var wNumb: any;

@Component({
  selector: 'app-sbas-sliders-two',
  templateUrl: './sbas-sliders-two.component.html',
  styleUrls: ['./sbas-sliders-two.component.scss']
})
export class SbasSlidersTwoComponent implements OnInit {
  @ViewChild('temporalFilter2', { static: true }) temporalFilter: ElementRef;

  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;

  public temporalAutoTicks = false;
  public temporalShowTicks = true;
  public temporalTickInterval = 7;

  public tempSlider;
  public temporal: number;
  public perpendicular: number;

  private firstLoad = true;
  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    private screenSize: ScreenSizeService
  ) { }

  ngOnInit(): void {
    const [tempSlider, tempValues$] = this.makeTemporalSlider$(this.temporalFilter);
    this.tempSlider = tempSlider;

    this.subs.add(
      tempValues$.subscribe(
        ([start]) => {
          const action = new filtersStore.SetTemporalRange({ start, end: null });
          this.store$.dispatch(action);
        }
      )
    );

    this.subs.add(
      this.store$.select(filtersStore.getTemporalRange).subscribe(
        temp => {
          this.temporal = temp.start;

          if (this.firstLoad) {
            this.tempSlider.set([this.temporal]);
            this.firstLoad = false;
          }
        }
      )
    );

    this.subs.add(
      this.store$.select(filtersStore.getPerpendicularRange).subscribe(
        perp => {
          this.perpendicular = perp.start;
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
      orientation: 'horizontal',
      direction: 'ltr',
      start: [48],
      behaviour: 'tap-drag',
      tooltips: false,
      step: 1,
      range: {
        'min': 0,
        'max': 60
      },
      pips: {
        mode: 'positions',
        values: [0, 20, 40, 60, 80, 100],
        density: 4,
        stepped: true,
        format: wNumb({
          decimals: 0,
          suffix: ' days'
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
