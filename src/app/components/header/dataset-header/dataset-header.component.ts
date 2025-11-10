import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { SubSink } from 'subsink';

import { AppState } from '@store';
import * as uiStore from '@store/ui';
import * as queueStore from '@store/queue';
import * as filterStore from '@store/filters';

import * as models from '@models';
import * as services from '@services';
import { SearchTypeSelectorComponent } from '../../shared/selectors/search-type-selector/search-type-selector.component';
import { DatasetSelectorComponent } from '../../shared/selectors/dataset-selector/dataset-selector.component';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { DocsModalComponent } from '../../shared/docs-modal/docs-modal.component';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { AoiFilterComponent } from './aoi-filter/aoi-filter.component';
import { NgClass, AsyncPipe } from '@angular/common';
import { DateSelectorComponent } from '../../shared/selectors/date-selector/date-selector.component';
import { MatButton } from '@angular/material/button';
import { SearchButtonComponent } from '../../shared/search-button/search-button.component';
import { MaxResultsSelectorComponent } from '../../shared/max-results-selector/max-results-selector.component';
import { HeaderButtonsComponent } from '../header-buttons/header-buttons.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-dataset-header',
  templateUrl: './dataset-header.component.html',
  styleUrls: ['./dataset-header.component.scss', '../header.component.scss'],
  imports: [
    SearchTypeSelectorComponent,
    DatasetSelectorComponent,
    MatSlideToggle,
    DocsModalComponent,
    MatTooltip,
    MatIcon,
    AoiFilterComponent,
    NgClass,
    DateSelectorComponent,
    MatButton,
    SearchButtonComponent,
    MaxResultsSelectorComponent,
    HeaderButtonsComponent,
    AsyncPipe,
    TranslateModule,
  ],
})
export class DatasetHeaderComponent implements OnInit, OnDestroy {
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
  private subs = new SubSink();

  public selectedDataset: string;
  public p = models.Props;

  ngOnInit() {
    this.subs.add(
      this.store$
        .select(filterStore.getSelectedDatasetId)
        .subscribe((selected) => {
          this.selectedDataset = selected;
        }),
    );
  }

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
  public test(value: boolean): void {
    this.store$.dispatch(new uiStore.SetFrameSelection(value));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
