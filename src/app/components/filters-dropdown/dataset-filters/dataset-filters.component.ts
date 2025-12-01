import { Component, Input, OnInit, OnDestroy, inject } from '@angular/core';
import { SubSink } from 'subsink';

import { Store } from '@ngrx/store';

import { AppState } from '@store/app.reducer';
import * as filtersStore from '@store/filters';

import * as models from '@models';
import { PropertyService, ScreenSizeService } from '@services';
// import { TranslateService } from "@ngx-translate/core";

enum FilterPanel {
  DATE = 'Date',
  PRODUCT = 'Product',
  ADDITIONAL = 'Additional',
  CAMPAIGN = 'Campaign',
  PATH = 'Path',
  AOI = 'Aoi',
  SEARCH = 'Search',
}

@Component({
  selector: 'app-dataset-filters',
  templateUrl: './dataset-filters.component.html',
  styleUrls: ['./dataset-filters.component.scss'],
  standalone: false,
})
export class DatasetFiltersComponent implements OnInit, OnDestroy {
  prop = inject(PropertyService);
  private store$ = inject<Store<AppState>>(Store);
  private screenSize = inject(ScreenSizeService);

  @Input() dataset: models.CMRProduct;
  @Input() selectedPanel: FilterPanel | null = null;

  panels = FilterPanel;
  defaultPanelOpenState = true;
  panelIsDisabled = true;
  customCollapsedHeight = '30px';
  customExpandedHeight = '30px';

  public datasets = models.datasetList;
  public selectedDataset: string;
  public p = models.Props;

  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;

  private subs = new SubSink();

  ngOnInit() {
    this.subs.add(
      this.store$
        .select(filtersStore.getSelectedDatasetId)
        .subscribe((selected) => (this.selectedDataset = selected)),
    );
  }

  public onDatasetChange(dataset: string): void {
    this.store$.dispatch(new filtersStore.SetSelectedDataset(dataset));
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
