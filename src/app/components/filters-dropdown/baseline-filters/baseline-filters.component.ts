import { Component, OnInit, OnDestroy } from '@angular/core';

import { AppState } from '@store';
import { Store } from '@ngrx/store';
import * as scenesStore from '@store/scenes';

import { SubSink } from 'subsink';
import * as models from '@models';
import { ScreenSizeService } from '@services';
import { TranslateService } from "@ngx-translate/core";

enum FilterPanel {
  MASTER = 'Master',
  DATE = 'Date',
  BASELINE = 'Baseline',
  SEARCH = 'Search'
}

@Component({
  selector: 'app-baseline-filters',
  templateUrl: './baseline-filters.component.html',
  styleUrls: ['./baseline-filters.component.scss']
})
export class BaselineFiltersComponent implements OnInit, OnDestroy {
  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;
  public areResultsLoaded: boolean;
  public translate: TranslateService

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

  ngOnInit() {
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
