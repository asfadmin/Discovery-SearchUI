import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import * as noUiSlider from 'nouislider';
import { Subject,  fromEvent, Observable} from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';

import { AppState } from '@store';
import { Store } from '@ngrx/store';
import * as filtersStore from '@store/filters';

import { SubSink } from 'subsink';
import { ScreenSizeService } from '@services';
import * as models from '@models';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

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
  public slider;
  public temporal: number;
  public perpendicular: models.Range<number> = {start: 0, end: 800};
  public lastPerpendicular: models.Range<number> = {start: 0, end: 800};

  public daysRange: models.Range<number> = {start: 1, end: 48};
  public lastRange: models.Range<number> = {start: 0, end: 0};
  public daysValues$ = new Subject<number[]>();
  public metersValues$ = new Subject<number[]>();
  // public perpStart = 800;

  private subs = new SubSink();

  options: UntypedFormGroup;
  colorControl: UntypedFormControl;

  meterDistanceControl: UntypedFormControl;
  daysControl: UntypedFormControl;

  constructor(
    private store$: Store<AppState>,
    private screenSize: ScreenSizeService,
    fb: UntypedFormBuilder
  ) {
    this.meterDistanceControl = new UntypedFormControl(this.perpendicular, Validators.min(-999));
    this.daysControl = new UntypedFormControl(this.daysRange, Validators.min(0));

    this.options = fb.group({
      color: this.colorControl,
      meterDistance: this.meterDistanceControl,
      days: this.daysControl,
    });
  }

  ngOnInit(): void {
    this.colorControl = new UntypedFormControl('primary');
    this.meterDistanceControl = new UntypedFormControl(this.perpendicular, Validators.min(-999));
    this.daysControl = new UntypedFormControl(this.daysRange, Validators.min(0));

    const daysSliderRef = this.makeDaysSlider$(this.temporalFilter);
    const tempSlider = daysSliderRef.slider;
    const daysValues$ = daysSliderRef.daysValues;

    this.tempSlider = tempSlider;

    fromEvent(this.meterFilter.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      }),
      filter(res => res.length > 0),
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe((_: Range) => {
        this.metersValues$.next([this.perpendicular.start, this.perpendicular.end] );
      });

    this.subs.add(
      this.screenSize.breakpoint$.subscribe(breakpoint => this.breakpoint = breakpoint )
    );

    this.subs.add(
      daysValues$.subscribe(
        range => {
          const action = new filtersStore.SetTemporalRange({ start: range[0], end: range[1] });
          this.store$.dispatch(action);
        }
      )
    );

    this.subs.add(
      this.store$.select(filtersStore.getTemporalRange).subscribe(
        temp => {
          // console.log('getTemporalRange:', temp);
          this.daysRange = {start: temp.start, end: temp.end};
          if (this.lastRange.start !== this.daysRange.start || this.lastRange.end !== this.daysRange.end) {
            // console.log('getTemporalRange:', this.daysRange);
            this.lastRange.start = this.daysRange.start;
            this.lastRange.end = this.daysRange.end;
            this.slider.set([temp.start, temp.end]);
          }
        }
      )
    );

    this.subs.add(
      this.store$.select(filtersStore.getPerpendicularRange).subscribe(
        perp => {
          // console.log('perp in getPerpendicularRange:', perp);
          this.perpendicular.start = perp.start;
          this.perpendicular.end  = perp.end;
          if (this.perpendicular.start !== this.lastPerpendicular.start || this.perpendicular.end !== this.perpendicular.end) {
            console.log('getPerpendicularRange Subscription: things are not equal');
            this.options.controls.meterDistance.setValue(this.perpendicular.start, this.perpendicular.end);
            this.lastPerpendicular = this.perpendicular;
            const action = new filtersStore.SetPerpendicularRange({
              start: this.perpendicular.start,
              end: this.perpendicular.end });
            this.store$.dispatch(action);
          }
        }
      )
    );

    this.subs.add(
      this.metersValues$.subscribe(
        ([start, end]) => {
          console.log('start in metersValues$:', start);
          const action = new filtersStore.SetPerpendicularRange({ start, end });
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
  }

  public updateDaysOffset() {
    this.options.controls.days.setValue(this.daysRange);
    this.daysValues$.next([this.daysRange.start, this.daysRange.end] );
  }

  private makeDaysSlider$(filterRef: ElementRef): {slider: any, daysValues: Observable<number[]>} {

    this.slider = noUiSlider.create(filterRef.nativeElement, {
      orientation: 'horizontal',
      direction: 'ltr',
      start: [1, 12],
      behaviour: 'tap-drag',
      tooltips: false,
      connect: true,
      step: 1,
      range: {
        'min': 0,
        'max': 60
      },
      pips: {
        mode: noUiSlider.PipsMode.Positions,
        values: [0, 20, 40, 60, 80, 100],
        density: 4,
        stepped: true,
        format: wNumb({
          decimals: 0,
          suffix: ' days'
        })
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
}
