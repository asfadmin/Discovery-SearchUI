import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import { SubSink } from 'subsink';

import * as models from '@models';
import * as filterStore from '@store/filters';

declare var wNumb: any;

import noUiSlider from 'nouislider';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, skip } from 'rxjs/operators';
import { ScreenSizeService } from '@services';
import { Breakpoints, SarviewsEventType } from '@models';

@Component({
  selector: 'app-sarviews-event-magnitude-selector',
  templateUrl: './sarviews-event-magnitude-selector.component.html',
  styleUrls: ['./sarviews-event-magnitude-selector.component.scss']
})
export class SarviewsEventMagnitudeSelectorComponent implements OnInit, OnDestroy {
  @ViewChild('magnitudeFilter', { static: true }) magnitudeFilter: ElementRef;
  public magnitudeRange: models.Range<number> = {start: 0, end: 10};
  public slider;
  public magSlider;

  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoint: models.Breakpoints;
  public breakpoints = models.Breakpoints;

  private subs = new SubSink();

  public magnitudeValues$ = new Subject<number[]>();

  public quakeTypesEnabled$ = this.store$.select(filterStore.getSarviewsEventTypes).pipe(
    map(eventTypes => {
      return eventTypes.length === 0 || eventTypes.includes(SarviewsEventType.QUAKE); }),
  );

  private fullPips = {
    mode: 'positions',
    values: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    density: 1,
    stepped: true,
    format: wNumb({
      decimals: 1,
      suffix: ' mag'
    })
  };

  private mobilePips =  {
    mode: 'positions',
    values: [0, 25, 50, 75, 100],
    density: 5,
    stepped: true,
    format: wNumb({
      decimals: 1,
      suffix: ' mag'
    })
  };

  constructor(private store$: Store<AppState>,
    private screenSize: ScreenSizeService,
    ) { }

  ngOnInit(): void {
    this.subs.add(
      this.store$.select(filterStore.getSarviewsMagnitudeRange).pipe(
        distinctUntilChanged((a, b) => {
          return a.start === b.start && a.end === b.end;
        }),
        filter(range => !!range),
      ).subscribe(
        magnitudeRange => {
          this.magnitudeRange = {
            start: magnitudeRange?.start,
            end: magnitudeRange?.end
          };
          this.magnitudeValues$.next([magnitudeRange.start, magnitudeRange.end]);
        }
      )
    );

    this.subs.add(
      this.breakpoint$.pipe(distinctUntilChanged()).subscribe(
        breakpoint => {
          this.breakpoint = breakpoint;
          this.OnUpdatePipSize(this.breakpoint);
        }
      )
    );

    const temp = this.makeMagnitudeSlider$(this.magnitudeFilter);
    this.magSlider = temp.magSlider;
    const magnitudeValuesObserverable$ = temp.magnitudeValues$;

    this.subs.add(
      magnitudeValuesObserverable$.pipe(
        skip(1),
      ).subscribe(
        ([start, end]) => {
          const action = new filterStore.SetSarviewsMagnitudeRange({
            start: start,
            end:  end
          });
          this.store$.dispatch(action);
        }
      )
    );

    this.subs.add(
      this.quakeTypesEnabled$.subscribe(
        isEnabled => {
          if (!isEnabled) {
            this.magnitudeFilter.nativeElement.setAttribute('disabled', true);
          } else {
            this.magnitudeFilter.nativeElement.removeAttribute('disabled');
          }
        }
      )
    );

  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private makeMagnitudeSlider$(filterRef: ElementRef): {magSlider: any, magnitudeValues$: Observable<number[]>} {
    // @ts-ignore
    this.slider = noUiSlider.create(filterRef.nativeElement, {
      orientation: 'horizontal',
      direction: 'ltr',
      start: [0, 10],
      behaviour: 'tap-drag',
      tooltips: false,
      step: 0.1,
      connect: true,
      range: {
        'min': 0,
        'max': 10
      },
      pips: this.fullPips
    });

    this.slider.on('update', (values: any[], _) => {
      this.magnitudeValues$.next(values.map(v => +v));
    });

    this.magnitudeValues$.next([0, 10]);

    return {
      magSlider: this.slider,
      magnitudeValues$: this.magnitudeValues$.asObservable().pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
    };
  }

  private OnUpdatePipSize(breakpoint: Breakpoints) {
    if (breakpoint === Breakpoints.MOBILE) {
      this.slider.updateOptions(
        {
          pips: this.mobilePips,
          step: 0.5
        },
        true
      );
    } else {
      this.slider.updateOptions(
        {
          pips: this.fullPips,
          step: 0.1
        },
        true
      );
    }
  }


}
