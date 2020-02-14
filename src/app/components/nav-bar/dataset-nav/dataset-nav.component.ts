import {Component, Output, EventEmitter, OnInit} from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as uiStore from '@store/ui';
import * as queueStore from '@store/queue';
import * as searchStore from '@store/search';
import * as userStore from '@store/user';
import * as filterStore from '@store/filters';

import * as models from '@models';
import * as services from '@services';

import { SavedSearchesComponent } from '@components/shared/saved-searches';

@Component({
  providers: [ SavedSearchesComponent ],
  selector: 'app-dataset-nav',
  templateUrl: './dataset-nav.component.html',
  styleUrls: ['./dataset-nav.component.scss', '../nav-bar.component.scss'],
})
export class DatasetNavComponent implements OnInit {
  @Output() public openQueue = new EventEmitter<void>();

  public datasets = models.datasetList;
  public queuedProducts$ = this.store$.select(queueStore.getQueuedProducts);
  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;
  public isLoggedIn = false;

  public selectedDataset: string;

  constructor(
    private store$: Store<AppState>,
    private screenSize: services.ScreenSizeService,
    private sscomp: SavedSearchesComponent,
  ) { }

  ngOnInit() {
    this.store$.select(userStore.getIsUserLoggedIn).subscribe(
      isLoggedIn => this.isLoggedIn = isLoggedIn
    );
    this.store$.select(filterStore.getSelectedDatasetId).subscribe(
      selected => this.selectedDataset = selected
    );
  }

  public onToggleFiltersMenu(): void {
    this.store$.dispatch(new uiStore.ToggleFiltersMenu());
    this.store$.dispatch(new uiStore.CloseAOIOptions());
  }

  public onOpenDownloadQueue(): void {
    this.openQueue.emit();
  }

  public onClearSearch(): void {
    this.store$.dispatch(new searchStore.ClearSearch());
  }

  public onOpenSavedSearches(): void {
    this.store$.dispatch(new uiStore.SetSaveSearchOn(false));
    this.store$.dispatch(new uiStore.OpenSidebar());
  }

  public saveCurrentSearch(): void {
    this.store$.dispatch(new uiStore.OpenSidebar());
    this.store$.dispatch(new uiStore.SetSaveSearchOn(true));
  }

  public closeAOIOptions(): void {
    this.store$.dispatch(new uiStore.CloseAOIOptions());
  }

  public onDatasetChange(dataset: string): void {
    this.store$.dispatch(new filterStore.SetSelectedDataset(dataset));
  }
}
