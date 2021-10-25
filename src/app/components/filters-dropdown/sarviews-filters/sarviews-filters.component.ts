import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ScreenSizeService } from '@services';
import { AppState } from '@store';

import * as models from '@models';
import * as scenesStore from '@store/scenes';

import { SubSink } from 'subsink';

enum FilterPanel {
  EVENT_DESCRIPTION = 'Event Filter',
  DATE = 'Date',
  TYPE = 'Event Types',
}


@Component({
  selector: 'app-sarviews-filters',
  templateUrl: './sarviews-filters.component.html',
  styleUrls: ['./sarviews-filters.component.scss']
})
export class SarviewsFiltersComponent implements OnInit, OnDestroy {
  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;
  public areResultsLoaded: boolean;


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
    this.subs.add(
      this.store$.select(scenesStore.getAreResultsLoaded).subscribe(
        areLoaded => this.areResultsLoaded = areLoaded
      )
    );
  }


  public isSelected(panel: FilterPanel): boolean {
    return this.selectedPanel === panel;
  }

  public selectPanel(panel: FilterPanel): void {
    this.selectedPanel = panel;
  }

  public onOpenHelp(url: string): void {
    window.open(url);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
