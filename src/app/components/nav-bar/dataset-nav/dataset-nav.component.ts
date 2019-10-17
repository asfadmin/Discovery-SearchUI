import { Component, Output, EventEmitter } from '@angular/core';

import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { ofType } from '@ngrx/effects';

import { AppState } from '@store';
import * as searchStore from '@store/search';
import * as uiStore from '@store/ui';
import * as queueStore from '@store/queue';

import * as models from '@models';
import * as services from '@services';

enum Breakpoints {
  FULL = 3,
  MEDIUM = 2,
  SMALL = 1,
}

@Component({
  selector: 'app-dataset-nav',
  templateUrl: './dataset-nav.component.html',
  styleUrls: ['./dataset-nav.component.css', '../nav-bar.component.scss'],
})
export class DatasetNavComponent {
  @Output() public openQueue = new EventEmitter<void>();

  public queuedProducts$ = this.store$.select(queueStore.getQueuedProducts);
  public breakpoint$ = this.screenSize.size$.pipe(
    map(({ width, height }) => {
      if (width > 1440) {
        return Breakpoints.FULL;
      } else if (width > 1140) {
        return Breakpoints.MEDIUM;
      } else {
        return Breakpoints.SMALL;
      }
    })
  );
  public breakpoints = Breakpoints;

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
