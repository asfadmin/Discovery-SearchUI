import { Component, OnDestroy, OnInit, inject } from '@angular/core';

import { AppState } from '@store';
import { Store } from '@ngrx/store';
import * as scenesStore from '@store/scenes';
import * as filtersStore from '@store/filters';

import { SubSink } from 'subsink';
import * as models from '@models';
import { ScreenSizeService } from '@services';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { SearchTypeSelectorComponent } from '../../shared/selectors/search-type-selector/search-type-selector.component';
import { BaselineFrameReferenceToggleComponent } from '../../shared/selectors/baseline-frame-reference-toggle/baseline-frame-reference-toggle.component';
import { DatasetSelectorComponent } from '../../shared/selectors/dataset-selector/dataset-selector.component';
import { MasterSceneSelectorComponent } from '../../shared/selectors/master-scene-selector/master-scene-selector.component';
import { CopyToClipboardComponent } from '../../shared/copy-to-clipboard/copy-to-clipboard.component';
import { DocsModalComponent } from '../../shared/docs-modal/docs-modal.component';
import { DateSelectorComponent } from '../../shared/selectors/date-selector/date-selector.component';
import { SeasonSelectorComponent } from '../../shared/selectors/season-selector/season-selector.component';
import { SbasOverlapSelectorComponent } from '../../shared/selectors/sbas-overlap-selector/sbas-overlap-selector.component';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
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
export class SbasFiltersComponent implements OnInit, OnDestroy {
  private store$ = inject<Store<AppState>>(Store);
  private screenSize = inject(ScreenSizeService);

  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;
  public areResultsLoaded: boolean;
  public shouldUseFramesForReference = false;

  public datasets = [models.beta];
  public selectedDataset = 'SENTINEL-1 INTERFEROGRAM (BETA)';

  selectedPanel: FilterPanel | null = null;
  panels = FilterPanel;
  defaultPanelOpenState = true;
  panelIsDisabled = true;
  customCollapsedHeight = '30px';
  customExpandedHeight = '30px';

  private subs = new SubSink();

  ngOnInit(): void {
    this.subs.add(
      this.store$
        .select(scenesStore.getAreResultsLoaded)
        .subscribe((areLoaded) => (this.areResultsLoaded = areLoaded)),
    );

    this.subs.add(
      this.store$
        .select(filtersStore.getShouldUseFramesForReference)
        .subscribe(
          (shouldUseFrames) =>
            (this.shouldUseFramesForReference = shouldUseFrames),
        ),
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

  public onDatasetChange(dataset: string): void {
    this.store$.dispatch(new filtersStore.SetSelectedDataset(dataset));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
