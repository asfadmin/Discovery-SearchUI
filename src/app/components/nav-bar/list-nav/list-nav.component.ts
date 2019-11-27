import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as queueStore from '@store/queue';
import * as uiStore from '@store/ui';

import { ScreenSizeService } from '@services';

@Component({
  selector: 'app-list-nav',
  templateUrl: './list-nav.component.html',
  styleUrls: ['./list-nav.component.css', '../nav-bar.component.scss']
})
export class ListNavComponent implements OnInit {
  @Output() public openQueue = new EventEmitter<void>();

  public queuedProducts$ = this.store$.select(queueStore.getQueuedProducts);

  constructor(
    private store$: Store<AppState>,
    private screenSize: ScreenSizeService
  ) { }

  ngOnInit() {
  }

  public onToggleFiltersMenu(): void {
    this.store$.dispatch(new uiStore.ToggleFiltersMenu());
  }

  public onOpenDownloadQueue(): void {
    this.openQueue.emit();
  }
}
