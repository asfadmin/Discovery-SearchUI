import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';

import noUiSlider from 'nouislider';
import {Subject, Observable, fromEvent} from 'rxjs';
import { delay, debounceTime, distinctUntilChanged, take, filter, map } from 'rxjs/operators';

import { AppState } from '@store';
import { Store } from '@ngrx/store';
import * as filtersStore from '@store/filters';

import { SubSink } from 'subsink';
import { ScreenSizeService } from '@services';
import * as models from '@models';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

declare var wNumb: any;

@Component({
  selector: 'app-sbas-sliders-two',
  templateUrl: './sbas-sliders-two.component.html',
  styleUrls: ['./sbas-sliders-two.component.scss']
})
export class SbasSlidersTwoComponent implements OnInit {
  @ViewChild('temporalFilter2', { static: true }) temporalFilter: ElementRef;
  @ViewChild('meterInputField', { static: true }) meterFilter: ElementRef;

  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoint: models.Breakpoints;
  public breakpoints = models.Breakpoints;

  public temporalAutoTicks = false;
  public temporalShowTicks = true;
  public temporalTickInterval = 7;

  public tempSlider;
  public temporal: number;
  public perpendicular: number;
  public days: number;
  public daysValues$ = new Subject<number[]>();
  public metersValues$ = new Subject<number[]>();
  public slider;

  private firstLoad = true;
  private subs = new SubSink();

  options: FormGroup;
  colorControl = new FormControl('primary');
  meterDistanceControl = new FormControl(this.perpendicular, Validators.min(-999));
  daysControl = new FormControl(this.days, Validators.min(0));

  constructor(
    private store$: Store<AppState>,
    private screenSize: ScreenSizeService,
    fb: FormBuilder
  ) {
      this.options = fb.group({
        color: this.colorControl,
        meterDistance: this.meterDistanceControl,
        days: this.daysControl,
    });
  }

  ngOnInit(): void {
    const [tempSlider, daysValues$] = this.makeDaysSlider$(this.temporalFilter);
    this.tempSlider = tempSlider;

    fromEvent(this.meterFilter.nativeElement, 'keyup').pipe(
      // get value
      map((event: any) => {
        return event.target.value;
      })
      // if character length greater then 2
      , filter(res => res.length > 0)
      // Time in milliseconds between key events
      , debounceTime(500)
      // If previous query is diffent from current
      , distinctUntilChanged()
      // subscription for response
    ).subscribe((meters: number) => {
      this.metersValues$.next([this.perpendicular, null] );
    });

    this.subs.add(
      this.screenSize.breakpoint$.subscribe(breakpoint => this.breakpoint = breakpoint )
    );

    this.subs.add(
      daysValues$.subscribe(
        ([start]) => {
          const action = new filtersStore.SetTemporalRange({ start, end: null });
          this.store$.dispatch(action);
        }
      )
    );

    this.subs.add(
      this.store$.select(filtersStore.getTemporalRange).subscribe(
        temp => {
          this.days = temp.start;
          if (this.firstLoad) {
            this.slider.set([this.days]);
            this.firstLoad = false;
          }
        }
      )
    );

    this.subs.add(
      this.store$.select(filtersStore.getPerpendicularRange).subscribe(
        perp => {
          this.perpendicular = perp.start;
          this.options.controls.meterDistance.setValue(this.perpendicular);
        }
      )
    );

    this.subs.add(
      this.metersValues$.subscribe(
        ([start]) => {
          const action = new filtersStore.SetPerpendicularRange({ start, end: null });
          this.store$.dispatch(action);
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

  public updatePerpendicular() {
    this.options.controls.meterDistance.setValue(this.perpendicular);
    // this.metersValues$.next([this.perpendicular, null] );
    // this.slider.set(this.perpendicular);
  }

  public updateDaysOffset() {
    this.options.controls.days.setValue(this.days);
    this.daysValues$.next([this.days, null] );
    // this.slider.set(this.days);
  }

  private makeDaysSlider$(filterRef: ElementRef) {
    // @ts-ignore
    this.slider = noUiSlider.create(filterRef.nativeElement, {
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

    this.slider.on('update', (values, handle) => {
      this.daysValues$.next(values.map(v => +v));
    });

    return [
      this.slider,
      this.daysValues$.asObservable().pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
    ];
  }
}
