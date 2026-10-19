import { NgClass, AsyncPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { SearchButtonComponent } from '@components/shared/search-button/search-button.component';
import { DatasetSelectorComponent } from '@components/shared/selectors/dataset-selector/dataset-selector.component';
import { DateSelectorComponent } from '@components/shared/selectors/date-selector/date-selector.component';
import { SearchTypeSelectorComponent } from '@components/shared/selectors/search-type-selector/search-type-selector.component';
import * as models from '@models';
import * as services from '@services';
import { AppState } from '@store';
import * as filterStore from '@store/filters';
import * as queueStore from '@store/queue';
import * as uiStore from '@store/ui';

import { AoiFilterComponent } from '../dataset-header/aoi-filter/aoi-filter.component';
import { HeaderButtonsComponent } from '../header-buttons/header-buttons.component';

@Component({
  selector: 'app-pair-selection-header',
  templateUrl: './pair-selection-header.component.html',
  styleUrls: [
    './pair-selection-header.component.scss',
    '../header.component.scss',
  ],
  imports: [
    SearchTypeSelectorComponent,
    DatasetSelectorComponent,
    MatIcon,
    AoiFilterComponent,
    NgClass,
    DateSelectorComponent,
    MatButton,
    SearchButtonComponent,
    HeaderButtonsComponent,
    AsyncPipe,
    TranslateModule,
  ],
})
export class PairSelectionHeaderComponent {
  private store$ = inject<Store<AppState>>(Store);
  private screenSize = inject(services.ScreenSizeService);
  prop = inject(services.PropertyService);
  frameMapService = inject(services.FrameMapService);

  public datasets = models.datasetList;
  public queuedProducts$ = this.store$.select(queueStore.getQueuedProducts);
  public breakpoint$ = this.screenSize.breakpoint$;
  public frameSelectionEnabled$ = this.store$.select(
    uiStore.getIsFrameSelectionEnabled,
  );
  public breakpoints = models.Breakpoints;
  public dataset = this.store$.selectSignal(filterStore.getSelectedDataset);
  public p = models.Props;

  public pairSelectionDatasets = computed(() => {
    return this.datasets.filter((dataset) =>
      dataset.properties.includes(models.Props.PAIR_SELECTION),
    );
  });

  public onToggleFiltersMenu(): void {
    this.store$.dispatch(new uiStore.OpenFiltersMenu());
    this.store$.dispatch(new uiStore.CloseAOIOptions());
  }

  public closeAOIOptions(): void {
    this.store$.dispatch(new uiStore.CloseAOIOptions());
  }

  public onDatasetChange(dataset: string): void {
    this.store$.dispatch(new filterStore.SetSelectedDataset(dataset));
  }
}
