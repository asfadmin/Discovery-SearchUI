import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import noUiSlider from 'nouislider';
import { Subject, Observable } from 'rxjs';
import { delay, debounceTime, distinctUntilChanged, take, filter, map } from 'rxjs/operators';

import { AppState } from '@store';
import { Store } from '@ngrx/store';
import * as filtersStore from '@store/filters';

import { SubSink } from 'subsink';
// import wNumb from 'wnumb';

@Component({
  selector: 'app-sbas-sliders',
  templateUrl: './sbas-sliders.component.html',
  styleUrls: ['./sbas-sliders.component.scss']
})
export class SbasSlidersComponent implements OnInit {
  @ViewChild('temporalFilter', { static: true }) temporalFilter: ElementRef;

  public temporalAutoTicks = false;
  public temporalDisabled = false;
  public temporalInvert = false;
  public temporalMax = 60;
  public temporalMin = 0;
  public temporalShowTicks = true;
  public temporalStep = 1;
  public temporalThumbLabel = true;
  public temporalValue = 48;
  public temporalVertical = false;
  public temporalTickInterval = 7;

  public tempSlider;
  public temporal: number;
  private temporalValue$: Observable<number>;

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
          console.log('start:', start);
          const action = new filtersStore.SetTemporalRange({ start, end: null });
          this.store$.dispatch(action);
        }
      )
    );

    this.subs.add(
      this.store$.select(filtersStore.getTemporalRange).subscribe(
        temp => {
          this.temporal = temp.start;
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
      start: [48],
      behaviour: 'drag',
      step: 1,
      range: {
        'min': 0,
        'max': 60
      },
      pips: {
        mode: 'positions',
        values: [0, 25, 50, 75, 100],
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
