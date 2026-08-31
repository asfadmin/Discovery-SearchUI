import { Component, inject, Signal } from '@angular/core';

import { AppState } from '@store';
import { Store } from '@ngrx/store';
import * as scenesStore from '@store/scenes';
import * as filtersStore from '@store/filters';

import * as models from '@models';
import { ScreenSizeService } from '@services';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { SearchTypeSelectorComponent } from '@components/shared/selectors/search-type-selector/search-type-selector.component';
import { BaselineFrameReferenceToggleComponent } from '@components/shared/selectors/baseline-frame-reference-toggle/baseline-frame-reference-toggle.component';
import { DatasetSelectorComponent } from '@components/shared/selectors/dataset-selector/dataset-selector.component';
import { MasterSceneSelectorComponent } from '@components/shared/selectors/master-scene-selector/master-scene-selector.component';
import { CopyToClipboardComponent } from '@components/shared/copy-to-clipboard/copy-to-clipboard.component';
import { DocsModalComponent } from '@components/shared/docs-modal/docs-modal.component';
import { DateSelectorComponent } from '@components/shared/selectors/date-selector/date-selector.component';
import { SeasonSelectorComponent } from '@components/shared/selectors/season-selector/season-selector.component';
import { SbasOverlapSelectorComponent } from '@components/shared/selectors/sbas-overlap-selector/sbas-overlap-selector.component';
import { TranslateModule } from '@ngx-translate/core';

enum FilterPanel {
  SEARCH = 'Search Options',
  MASTER = 'Scene',
  FILTER1 = 'Spatial Filter',
  FILTER2 = 'Temporal Filter',
  DATE = 'Date',
  SEASON = 'Season',
  OVERLAP = 'Overlap',
}

@Component({
  selector: 'app-sbas-filters',
  templateUrl: './sbas-filters.component.html',
  styleUrls: ['./sbas-filters.component.scss'],
  imports: [
    MatAccordion,

    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    SearchTypeSelectorComponent,
    BaselineFrameReferenceToggleComponent,
    DatasetSelectorComponent,
    MasterSceneSelectorComponent,
    CopyToClipboardComponent,
    DocsModalComponent,
    DateSelectorComponent,
    SeasonSelectorComponent,
    SbasOverlapSelectorComponent,
    AsyncPipe,
    UpperCasePipe,
    TranslateModule,
  ],
})
export class SbasFiltersComponent {
  private store$ = inject<Store<AppState>>(Store);
  private screenSize = inject(ScreenSizeService);

  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;
  public areResultsLoaded: Signal<boolean> = this.store$.selectSignal(
    scenesStore.getAreResultsLoaded,
  );
  public shouldUseFramesForReference: Signal<boolean> =
    this.store$.selectSignal(filtersStore.getShouldUseFramesForReference);

  public datasets = [models.beta];
  public selectedDataset = 'SENTINEL-1 INTERFEROGRAM (BETA)';

  selectedPanel: FilterPanel | null = null;
  panels = FilterPanel;
  defaultPanelOpenState = true;
  panelIsDisabled = true;
  customCollapsedHeight = '30px';
  customExpandedHeight = '30px';

  public isSelected(panel: FilterPanel): boolean {
    return this.selectedPanel === panel;
  }

  public selectPanel(panel: FilterPanel): void {
    this.selectedPanel = panel;
  }

  public onOpenHelp(url: string): void {
    window.open(url);
  }

  public onDatasetChange(dataset: string): void {
    this.store$.dispatch(new filtersStore.SetSelectedDataset(dataset));
  }
}
