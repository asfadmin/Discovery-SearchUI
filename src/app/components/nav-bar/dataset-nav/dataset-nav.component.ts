import { Component, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as uiStore from '@store/ui';
import * as queueStore from '@store/queue';

import * as models from '@models';
import * as services from '@services';

@Component({
  selector: 'app-dataset-nav',
  templateUrl: './dataset-nav.component.html',
  styleUrls: ['./dataset-nav.component.css', '../nav-bar.component.scss'],
})
export class DatasetNavComponent {
  @Output() public openQueue = new EventEmitter<void>();

  public queuedProducts$ = this.store$.select(queueStore.getQueuedProducts);
  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;

  constructor(
    private store$: Store<AppState>,
    private screenSize: services.ScreenSizeService
  ) { }

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
