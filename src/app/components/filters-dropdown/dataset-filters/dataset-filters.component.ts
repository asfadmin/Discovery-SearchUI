import {
  Component,
  input,
  OnInit,
  OnDestroy,
  inject,
  signal,
} from '@angular/core';
import { SubSink } from 'subsink';

import { Store } from '@ngrx/store';

import { AppState } from '@store/app.reducer';
import * as filtersStore from '@store/filters';

import * as models from '@models';
import { PropertyService, ScreenSizeService } from '@services';
import { AsyncPipe } from '@angular/common';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { SearchTypeSelectorComponent } from '@components/shared/selectors/search-type-selector/search-type-selector.component';
import { DatasetSelectorComponent } from '@components/shared/selectors/dataset-selector/dataset-selector.component';
import { DocsModalComponent } from '@components/shared/docs-modal/docs-modal.component';
import { AoiOptionsComponent } from '@components/shared/aoi-options/aoi-options.component';
import { DateSelectorComponent } from '@components/shared/selectors/date-selector/date-selector.component';
import { SeasonSelectorComponent } from '@components/shared/selectors/season-selector/season-selector.component';
import { ProductScienceSelectorComponent } from '@components/shared/selectors/product-science-selector/product-science-selector.component';
import { ProductionConfigSelectorComponent } from '@components/shared/selectors/production-config-selector/production-config-selector.component';
import { OtherSelectorComponent } from '@components/shared/selectors/other-selector/other-selector.component';
import { ObservationPanelSelectorComponent } from '@components/shared/selectors/observation-panel-selector/observation-panel-selector.component';
import { PathSelectorComponent } from '@components/shared/selectors/path-selector/path-selector.component';
import { MissionSelectorComponent } from '@components/shared/selectors/mission-selector/mission-selector.component';
import { BurstSelectorComponent } from '@components/shared/selectors/burst-selector/burst-selector.component';
import { OperaS1SelectorComponent } from '@components/shared/selectors/opera-s1-selector/opera-s1-selector.component';
import { TranslateModule } from '@ngx-translate/core';
import { GranuleListSelectorComponent } from '@components/shared/selectors/granule-list-selector/granule-list-selector.component';
import { IsRelevantPipe } from '@pipes/relevant.pipe';
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
    GranuleListSelectorComponent,
    AsyncPipe,
    IsRelevantPipe,
    TranslateModule,
  ],
})
export class DatasetFiltersComponent implements OnInit, OnDestroy {
  prop = inject(PropertyService);
  private store$ = inject<Store<AppState>>(Store);
  private screenSize = inject(ScreenSizeService);

  dataset = input<models.CMRProduct | null>(null);
  selectedPanel = signal<FilterPanel | null>(null);

  public actualDataset = this.store$.selectSignal(
    filtersStore.getSelectedDataset,
  );
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

  public selectPanel(panel: FilterPanel): void {
    this.selectedPanel.set(panel);
  }

  public onOpenHelp(url: string): void {
    window.open(url);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
