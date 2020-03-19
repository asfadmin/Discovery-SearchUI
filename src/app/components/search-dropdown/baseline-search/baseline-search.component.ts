import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import noUiSlider from 'nouislider';

import { Subject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, take, tap } from 'rxjs/operators';
import { AppState } from '@store';
import { Store } from '@ngrx/store';
import * as filtersStore from '@store/filters';
import { SubSink } from 'subsink';

import * as models from '@models';
import { PropertyService, ScreenSizeService } from '@services';

enum FilterPanel {
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
    perpValues$.subscribe(
      ([start, end]) => {
        this.store$.dispatch(new filtersStore.SetPerpendicularRange({
          start, end
        }));
      }
    );

    const [tempSlider, tempValues$] = this.makeSlider$(this.temporalFilter);

    this.tempSlider = tempSlider;
    tempValues$.subscribe(
      ([start, end]) =>
        this.store$.dispatch(new filtersStore.SetTemporalRange({
          start, end
        }))
    );

    this.store$.select(filtersStore.getTemporalRange).pipe(
      take(1)
    ).subscribe(
      temp => this.tempSlider.set([temp.start, temp.end])
    );

    this.subs.add(
      this.store$.select(filtersStore.getTemporalRange).subscribe(
        temp => this.tempRange = temp
      )
    );

    this.store$.select(filtersStore.getPerpendicularRange).pipe(
      take(1)
    ).subscribe(
      perp => this.perpSlider.set([perp.start, perp.end])
    );

    this.subs.add(
      this.store$.select(filtersStore.getPerpendicularRange).subscribe(
        perp => this.perpRange = perp
      )
    );
  }

  private makeSlider$(filter: ElementRef) {
    const values$ = new Subject<number[]>();
    const slider = noUiSlider.create(filter.nativeElement, {
      start: [20, 80],
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

  public isSelected(panel: FilterPanel): boolean {
    return this.selectedPanel === panel;
  }

  public selectPanel(panel: FilterPanel): void {
    this.selectedPanel = panel;
  }
}
