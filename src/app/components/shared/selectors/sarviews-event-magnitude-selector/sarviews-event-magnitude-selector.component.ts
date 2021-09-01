import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import { SubSink } from 'subsink';

import * as models from '@models';
import * as filterStore from '@store/filters';

declare var wNumb: any;

import noUiSlider from 'nouislider';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ScreenSizeService } from '@services';

@Component({
  selector: 'app-sarviews-event-magnitude-selector',
  templateUrl: './sarviews-event-magnitude-selector.component.html',
  styleUrls: ['./sarviews-event-magnitude-selector.component.scss']
})
export class SarviewsEventMagnitudeSelectorComponent implements OnInit, OnDestroy {
  @ViewChild('magnitudeFilter', { static: true }) magnitudeFilter: ElementRef;
  public magnitudeRange: models.Range<number> = {start: null, end: null};
  public slider;
  public magSlider;

  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoint: models.Breakpoints;
  public breakpoints = models.Breakpoints;

  private subs = new SubSink();

  public magnitudeValues$ = new Subject<number[]>();

  constructor(private store$: Store<AppState>, private screenSize: ScreenSizeService) { }

  ngOnInit(): void {
    this.subs.add(
      this.store$.select(filterStore.getSarviewsMagnitudeRange).subscribe(
        magnitudeRange => {
          this.magnitudeRange = magnitudeRange;
          this.magnitudeValues$.next([magnitudeRange.start, magnitudeRange.end]);
        }
      )
    );

    const temp = this.makeMagnitudeSlider$(this.magnitudeFilter);
    this.magSlider = temp.magSlider;
    const magnitudeValuesObserverable$ = temp.magnitudeValues$;

    this.subs.add(
      magnitudeValuesObserverable$.subscribe(
        ([start, end]) => {
          const action = new filterStore.SetSarviewsMagnitudeRange({ start, end });
          this.store$.dispatch(action);
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
      pips: {
        mode: 'positions',
        values: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        density: 1,
        stepped: true,
        format: wNumb({
          decimals: 1,
          suffix: ' mag'
        })
      }
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



}
