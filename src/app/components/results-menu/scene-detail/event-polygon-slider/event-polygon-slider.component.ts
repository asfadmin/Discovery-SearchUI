import { Component, ElementRef, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { MapService } from '@services';
import { AppState } from '@store';
import { getSelectedSarviewsEvent } from '@store/scenes';
declare var wNumb: any;

import * as noUiSlider from 'nouislider';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, withLatestFrom } from 'rxjs/operators';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-event-polygon-slider',
  templateUrl: './event-polygon-slider.component.html',
  styleUrls: ['./event-polygon-slider.component.scss']
})
export class EventPolygonSliderComponent implements OnInit, OnDestroy {
  @ViewChild('polygonScale', { static: true }) polygonScaleRef: ElementRef;
  @Output() polygonScale$ = new Subject<number>();
  // @Output() polygonScale: EventEmitter<number> = new EventEmitter();

  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    private mapService: MapService) { }

  ngOnInit(): void {
    const polygonSlider = this.makePolygonSlider$(this.polygonScaleRef);

    const sliderScale$: Observable<number> = polygonSlider.scaleValues$;

    this.subs.add(
      sliderScale$.pipe(
        withLatestFrom(this.store$.select(getSelectedSarviewsEvent))
      ).subscribe(
        ([scale, selectedEvent]) => this.mapService.onSetSarviewsPolygon(selectedEvent, scale)
      )
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private makePolygonSlider$(filterRef: ElementRef) {
    // @ts-ignore
    const slider = noUiSlider.create(filterRef.nativeElement, {
      orientation: 'horizontal',
      direction: 'ltr',
      start: [1],
      behaviour: 'tap-drag',
      tooltips: false,
      // step: 0.1,
      connect: 'lower',
      range: {
        'min': 0.1,
        'max': 4
      },
      pips: {
        mode: noUiSlider.PipsMode.Positions,
        values: [0, 24, 49, 75, 100],
        density: 1,
        stepped: true,
        format: wNumb({
          decimals: 1,
        })
      }
    });

    slider.on('update', (value, _) => {
      this.polygonScale$.next(+value);
    });

    this.polygonScale$.next(1);

    return {
      slider,
      scaleValues$: this.polygonScale$.asObservable().pipe(
        // debounceTime(500),
        distinctUntilChanged()
      )
    };
  }

}
