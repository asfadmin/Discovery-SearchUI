import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import noUiSlider from 'nouislider';

import { Subject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, take, tap, filter, map } from 'rxjs/operators';
import { AppState } from '@store';
import { Store } from '@ngrx/store';
import * as filtersStore from '@store/filters';
import * as scenesStore from '@store/scenes';
import { SubSink } from 'subsink';

import * as models from '@models';
import { PropertyService, ScreenSizeService } from '@services';

enum FilterPanel {
  MASTER = 'Master',
  DATE = 'Date',
  BASELINE = 'Baseline'
}

@Component({
  selector: 'app-baseline-search',
  templateUrl: './baseline-search.component.html',
  styleUrls: ['./baseline-search.component.scss']
})
export class BaselineSearchComponent implements OnInit {
  @ViewChild('temporalFilter', { static: true }) temporalFilter: ElementRef;
  @ViewChild('perpendicularFilter', { static: true }) perpendicularFilter: ElementRef;

  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;

  public tempRange: models.Range<number>;
  public perpRange: models.Range<number>;

  public perpSlider;
  public tempSlider;

  private perpendicularValues$: Observable<number[]>;
  private temporalValues$: Observable<number[]>;

  selectedPanel: FilterPanel | null = null;
  panels = FilterPanel;
  defaultPanelOpenState = true;
  panelIsDisabled = true;
  customCollapsedHeight = '30px';
  customExpandedHeight = '30px';

  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    private screenSize: ScreenSizeService
  ) { }

  ngOnInit(): void {
    const [perpSlider, perpValues$] = this.makeSlider$(this.perpendicularFilter);
    this.perpSlider = perpSlider;

    this.subs.add(
      perpValues$.subscribe(
        ([start, end]) => {
          const action = new filtersStore.SetPerpendicularRange({ start, end });
          this.store$.dispatch(action);
        }
      )
    );

    const [tempSlider, tempValues$] = this.makeSlider$(this.temporalFilter);
    this.tempSlider = tempSlider;

    this.subs.add(
      tempValues$.subscribe(
        ([start, end]) => {
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
        filter(range => range.min !== null && range.max !== null)
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
        filter(range => range.min !== null && range.max !== null)
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
        perp => this.perpRange = perp
      )
    );
  }

  private makeSlider$(filterRef: ElementRef) {
    const values$ = new Subject<number[]>();
    const slider = noUiSlider.create(filterRef.nativeElement, {
      start: [null, null],
      behaviour: 'drag',
      connect: true,
      range: {
        'min': 0,
        'max': 100
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

  private setRangeOnSlider(slider, range): void {
    slider.updateOptions({
      range: {
        min: range.start,
        max: range.end
      }
    });

    slider.set([range.start, range.end]);
  }

  public isSelected(panel: FilterPanel): boolean {
    return this.selectedPanel === panel;
  }

  public selectPanel(panel: FilterPanel): void {
    this.selectedPanel = panel;
  }
}
