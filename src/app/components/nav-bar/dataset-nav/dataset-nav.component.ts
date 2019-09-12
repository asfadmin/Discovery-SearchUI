import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { Store, ActionsSubject } from '@ngrx/store';
import { ofType } from '@ngrx/effects';

import { AppState } from '@store';
import * as searchStore from '@store/search';
import * as uiStore from '@store/ui';
import * as queueStore from '@store/queue';

import * as models from '@models';

@Component({
  selector: 'app-dataset-nav',
  templateUrl: './dataset-nav.component.html',
  styleUrls: ['./dataset-nav.component.css', '../nav-bar.component.scss'],
})
export class DatasetNavComponent implements OnInit {
  @Output() public openQueue = new EventEmitter<void>();

  public queuedProducts$ = this.store$.select(queueStore.getQueuedProducts);

  constructor(
    private store$: Store<AppState>,
    private actions$: ActionsSubject,
  ) { }

  ngOnInit() {
    this.actions$.pipe(
      ofType<searchStore.MakeSearch>(searchStore.SearchActionType.MAKE_SEARCH),
    ).subscribe(
      _ => this.closeMenus()
    );

    this.store$.select(uiStore.getSearchType).subscribe(
      () => this.closeMenus()
    );
  }

  public closeMenus(): void {
    this.store$.dispatch(new uiStore.CloseFiltersMenu());
    this.store$.dispatch(new uiStore.CloseAOIOptions());
  }

  public onToggleFiltersMenu(): void {
    this.store$.dispatch(new uiStore.ToggleFiltersMenu());
    this.store$.dispatch(new uiStore.CloseAOIOptions());
  }

  public onOpenDownloadQueue(): void {
    this.openQueue.emit();
  }

  public closeAOIOptions(): void {
    this.store$.dispatch(new uiStore.CloseAOIOptions());
  }
}
