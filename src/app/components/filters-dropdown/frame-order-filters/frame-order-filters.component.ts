import { Component, Input, OnInit, OnDestroy, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';

import { SubSink } from 'subsink';

import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as filtersStore from '@store/filters';

import * as models from '@models';
import { PropertyService, ScreenSizeService } from '@services';
import { FlightDirectionSelectorComponent } from '@components/shared/selectors/flight-direction-selector/flight-direction-selector.component';
import { DocsModalComponent } from '@components/shared/docs-modal/docs-modal.component';
import { PathSelectorComponent } from '@components/shared/selectors/path-selector';
import { TranslateModule } from '@ngx-translate/core';

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
    FormsModule,
    FlightDirectionSelectorComponent,
    MatSelectModule,
    MatExpansionModule,
    DocsModalComponent,
    PathSelectorComponent,
    TranslateModule,
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
