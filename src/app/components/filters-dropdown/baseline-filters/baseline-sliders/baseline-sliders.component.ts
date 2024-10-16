import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import noUiSlider from 'nouislider';

import { Observable, Subject } from 'rxjs';
import { delay, debounceTime, distinctUntilChanged, take, filter } from 'rxjs/operators';
import { AppState } from '@store';
import { Store } from '@ngrx/store';
import * as filtersStore from '@store/filters';
import * as scenesStore from '@store/scenes';
import { SubSink } from 'subsink';

import * as models from '@models';

export interface BaselineSlider {
  slider: any;
  values: Observable<number[]>;
}

@Component({
  selector: 'app-baseline-sliders',
  templateUrl: './baseline-sliders.component.html',
  styleUrls: ['./baseline-sliders.component.scss']
})
export class BaselineSlidersComponent implements OnInit, OnDestroy {
  @ViewChild('temporalFilter', { static: true }) temporalFilter: ElementRef;
  @ViewChild('perpendicularFilter', { static: true }) perpendicularFilter: ElementRef;

  public tempRange: models.Range<number>;
  public perpRange: models.Range<number>;

  public perpSlider;
  public tempSlider;

  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
  ) { }

  ngOnInit(): void {
    // this.store$.dispatch(new filtersStore.ClearPerpendicularRange());
    const perpBaselineSlider = this.makeSlider$(this.perpendicularFilter);
    const perpSlider = perpBaselineSlider.slider;
    const perpValues$ = perpBaselineSlider.values;

    this.perpSlider = perpSlider;

    this.subs.add(
      perpValues$.subscribe(
        ([start, end]) => {
          if (start === this.perpRange.start && end === this.perpRange.end) {
            return;
          }

          const action = new filtersStore.SetPerpendicularRange({ start, end });
          this.store$.dispatch(action);
        }
      )
    );

    const tempBaselineSlider = this.makeSlider$(this.temporalFilter);
    const tempSlider = tempBaselineSlider.slider;
    const tempValues$ = tempBaselineSlider.values;
    this.tempSlider = tempSlider;

    this.subs.add(
      tempValues$.subscribe(
        ([start, end]) => {
          if (start === this.tempRange.start && end === this.tempRange.end) {
            return;
          }

          const action = new filtersStore.SetTemporalRange({ start, end });
          this.store$.dispatch(action);
        }
      )
    );

    this.store$.select(filtersStore.getTemporalRange).pipe(
      take(1),
      filter(range => range.start !== null && range.end !== null),
    ).subscribe(
      temp => {
        this.setRangeOnSlider(this.tempSlider, temp);
      }
    );

    this.subs.add(
      this.store$.select(scenesStore.getTemporalExtrema).pipe(
        filter(range => range.min !== null && range.max !== null),
        delay(20)
      ).subscribe(
        range => {
          this.tempSlider.updateOptions({ range });

          this.tempSlider.set([
            this.tempRange.start === null ? range.min : null,
            this.tempRange.end === null ? range.max : null
          ]);
        }
      )
    );

    this.subs.add(
      this.store$.select(filtersStore.getTemporalRange).subscribe(
        temp => {
          this.tempRange = temp;
          tempSlider.set([temp.start, temp.end]);
        }
      )
    );

    this.store$.select(filtersStore.getPerpendicularRange).pipe(
      take(1),
      filter(range => range.start !== null && range.end !== null)
    ).subscribe(
      perp => {
        this.setRangeOnSlider(this.perpSlider, perp);
      }
    );

    this.subs.add(
      this.store$.select(scenesStore.getPerpendicularExtrema).pipe(
        filter(range => range.min !== null && range.max !== null),
        delay(20)
      ).subscribe(
        range => {
          this.perpSlider.updateOptions({ range });
          this.perpSlider.set([
            this.perpRange.start === null ? range.min : null,
            this.perpRange.end === null ? range.max : null
          ]);
        }
      )
    );

    this.subs.add(
      this.store$.select(filtersStore.getPerpendicularRange).subscribe(
        perp => {
          this.perpRange = perp;
          perpSlider.set([perp.start, perp.end]);
        }
      )
    );
  }

  private makeSlider$(filterRef: ElementRef): BaselineSlider {
    const values$ = new Subject<number[]>();
    const slider = noUiSlider.create(filterRef.nativeElement, {
      start: [null, null],
      behaviour: 'drag',
      connect: true,
      range: {
        'min': -999,
        'max': 999
      }
    });

    slider.on('update', (values, _) => {
      values$.next(values.map(v => +v));
    });

    return {
      slider,
      values: values$.asObservable().pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      };
  }

  private setRangeOnSlider(slider, range): void {
    slider.updateOptions({
      range: {
        min: range.start,
        max: range.end
      }
    });

    slider.set([range.start, range.end]);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
