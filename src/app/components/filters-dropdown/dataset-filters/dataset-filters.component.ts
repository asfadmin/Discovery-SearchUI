import { Component, Input, OnInit, OnDestroy, inject } from '@angular/core';
import { SubSink } from 'subsink';

import { Store } from '@ngrx/store';

import { AppState } from '@store/app.reducer';
import * as filtersStore from '@store/filters';

import * as models from '@models';
import { PropertyService, ScreenSizeService } from '@services';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { SearchTypeSelectorComponent } from '../../shared/selectors/search-type-selector/search-type-selector.component';
import { DatasetSelectorComponent } from '../../shared/selectors/dataset-selector/dataset-selector.component';
import { DocsModalComponent } from '../../shared/docs-modal/docs-modal.component';
import { AoiOptionsComponent } from '../../shared/aoi-options/aoi-options.component';
import { DateSelectorComponent } from '../../shared/selectors/date-selector/date-selector.component';
import { SeasonSelectorComponent } from '../../shared/selectors/season-selector/season-selector.component';
import { ProductScienceSelectorComponent } from '../../shared/selectors/product-science-selector/product-science-selector.component';
import { ProductionConfigSelectorComponent } from '../../shared/selectors/production-config-selector/production-config-selector.component';
import { OtherSelectorComponent } from '../../shared/selectors/other-selector/other-selector.component';
import { ObservationPanelSelectorComponent } from '../../shared/selectors/observation-panel-selector/observation-panel-selector.component';
import { PathSelectorComponent } from '../../shared/selectors/path-selector/path-selector.component';
import { MissionSelectorComponent } from '../../shared/selectors/mission-selector/mission-selector.component';
import { BurstSelectorComponent } from '../../shared/selectors/burst-selector/burst-selector.component';
import { OperaS1SelectorComponent } from '../../shared/selectors/opera-s1-selector/opera-s1-selector.component';
import { AsyncPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
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
  imports: [
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    SearchTypeSelectorComponent,
    DatasetSelectorComponent,
    DocsModalComponent,
    AoiOptionsComponent,
    DateSelectorComponent,
    SeasonSelectorComponent,
    ProductScienceSelectorComponent,
    ProductionConfigSelectorComponent,
    OtherSelectorComponent,
    ObservationPanelSelectorComponent,
    PathSelectorComponent,
    MissionSelectorComponent,
    BurstSelectorComponent,
    OperaS1SelectorComponent,
    AsyncPipe,
    TranslateModule,
  ],
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
