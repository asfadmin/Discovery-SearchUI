import { AsyncPipe } from '@angular/common';
import { Component, Output, EventEmitter, inject, Signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { SearchButtonComponent } from '@components/shared/search-button/search-button.component';
import { BaselineFrameReferenceToggleComponent } from '@components/shared/selectors/baseline-frame-reference-toggle/baseline-frame-reference-toggle.component';
import { DatasetSelectorComponent } from '@components/shared/selectors/dataset-selector/dataset-selector.component';
import { MasterSceneSelectorComponent } from '@components/shared/selectors/master-scene-selector/master-scene-selector.component';
import { SearchTypeSelectorComponent } from '@components/shared/selectors/search-type-selector/search-type-selector.component';
import { Breakpoints } from '@models';
import * as models from '@models';
import { ScreenSizeService } from '@services';
import { AppState } from '@store';
import * as filtersStore from '@store/filters';
import * as queueStore from '@store/queue';
import * as scenesStore from '@store/scenes';
import * as searchStore from '@store/search';
import * as uiStore from '@store/ui';

import { HeaderButtonsComponent } from '../header-buttons/header-buttons.component';

@Component({
  selector: 'app-baseline-header',
  templateUrl: './baseline-header.component.html',
  styleUrls: ['./baseline-header.component.css', '../header.component.scss'],
  imports: [
    SearchTypeSelectorComponent,
    BaselineFrameReferenceToggleComponent,
    DatasetSelectorComponent,
    MasterSceneSelectorComponent,
    SearchButtonComponent,
    HeaderButtonsComponent,
    MatButton,
    MatIcon,
    AsyncPipe,
    TranslateModule,
  ],
})
export class BaselineHeaderComponent {
  private store$ = inject<Store<AppState>>(Store);
  private screenSize = inject(ScreenSizeService);

  @Output() public openQueue = new EventEmitter<void>();

  public queuedProducts$ = this.store$.select(queueStore.getQueuedProducts);
  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = Breakpoints;

  public selectedProducts$ = this.store$.select(
    scenesStore.getSelectedSceneProducts,
  );

  public searchType$ = this.store$.select(searchStore.getSearchType);
  public searchTypes = models.SearchType;

  public datasets = [models.beta];
  public selectedDataset = 'SENTINEL-1 INTERFEROGRAM (BETA)';

  public shouldUseFramesForReference: Signal<boolean> =
    this.store$.selectSignal(filtersStore.getShouldUseFramesForReference);

  public onToggleFiltersMenu(): void {
    this.store$.dispatch(new uiStore.OpenFiltersMenu());
  }

  public onDatasetChange(dataset: string): void {
    this.store$.dispatch(new filtersStore.SetSelectedDataset(dataset));
  }

  public onOpenDownloadQueue(): void {
    this.openQueue.emit();
  }
}
