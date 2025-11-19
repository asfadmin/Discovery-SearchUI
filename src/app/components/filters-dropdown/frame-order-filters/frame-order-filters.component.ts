import { Component, Input, OnInit, OnDestroy, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';

import { PathSelectorModule } from '@components/shared/selectors/path-selector';
import { OtherSelectorModule } from '@components/shared/selectors/other-selector';
import { SeasonSelectorModule } from '@components/shared/selectors/season-selector';
import { MissionSelectorModule } from '@components/shared/selectors/mission-selector';
import { SearchTypeSelectorModule } from '@components/shared/selectors/search-type-selector';

import { DateSelectorModule } from '@components/shared/selectors/date-selector';
import { DatasetSelectorModule } from '@components/shared/selectors/dataset-selector';
import { AoiOptionsModule } from '@components/shared/aoi-options';
import { DocsModalModule } from '@components/shared/docs-modal';
import { BurstSelectorModule } from '@components/shared/selectors/burst-selector';
import { OperaS1SelectorModule } from '@components/shared/selectors/opera-s1-selector';

import { SharedModule } from '@shared';

import { SubSink } from 'subsink';

import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as filtersStore from '@store/filters';

import * as models from '@models';
import { PropertyService, ScreenSizeService } from '@services';
import { FlightDirectionSelectorComponent } from '@components/shared/selectors/flight-direction-selector/flight-direction-selector.component';

enum FilterPanel {
  DATE = 'Date',
  ADDITIONAL = 'Additional',
  CAMPAIGN = 'Campaign',
  PATH = 'Path',
  AOI = 'Aoi',
  SEARCH = 'Search',
}

@Component({
  selector: 'app-frame-order-filters',
  imports: [
    CommonModule,
    FormsModule,
    FlightDirectionSelectorComponent,
    MatSelectModule,
    MatExpansionModule,
    DocsModalModule,
    MissionSelectorModule,
    PathSelectorModule,
    OtherSelectorModule,
    SeasonSelectorModule,
    DateSelectorModule,
    DatasetSelectorModule,
    AoiOptionsModule,
    SearchTypeSelectorModule,
    BurstSelectorModule,
    OperaS1SelectorModule,
    SharedModule,
  ],
  templateUrl: './frame-order-filters.component.html',
  styleUrl: './frame-order-filters.component.scss',
})
export class FrameOrderFiltersComponent implements OnInit, OnDestroy {
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
  flightDirections: models.FlightDirection[];

  public datasets = models.datasetList;
  public selectedDataset: string;
  public p = models.Props;

  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;

  public flightDirectionTypes = models.flightDirections;

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
