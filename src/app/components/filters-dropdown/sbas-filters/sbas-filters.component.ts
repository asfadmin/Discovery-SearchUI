import {Component, OnDestroy, OnInit} from '@angular/core';

import { AppState } from '@store';
import { Store } from '@ngrx/store';
import * as scenesStore from '@store/scenes';

import { SubSink } from 'subsink';
import * as models from '@models';
import { ScreenSizeService } from '@services';

enum FilterPanel {
  SEARCH = 'Search Options',
  MASTER = 'Scene',
  FILTER1 = 'Spatial Filter',
  FILTER2 = 'Temporal Filter',
  DATE = 'Date',
  SEASON = 'Season',
  OVERLAP = 'Overlap'
}

@Component({
  selector: 'app-sbas-filters',
  templateUrl: './sbas-filters.component.html',
  styleUrls: ['./sbas-filters.component.scss']
})
export class SbasFiltersComponent implements OnInit, OnDestroy {
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
    private screenSize: ScreenSizeService,
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
