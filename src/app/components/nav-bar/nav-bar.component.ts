import { Component, OnInit, EventEmitter, Output, ViewChild, Input } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as searchStore from '@store/search';

import { MatDialog } from '@angular/material/dialog';
import { QueueComponent } from '@components/nav-bar/queue';

import * as models from '@models/index';
import * as services from '@services';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],

})
export class NavBarComponent {
  @Input() isLoading: boolean;

  public searchType$ = this.store$.select(searchStore.getSearchType);
  public searchTypes = models.SearchType;
  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;

  constructor(
    private store$: Store<AppState>,
    private dialog: MatDialog,
    private screenSize: services.ScreenSizeService,
  ) { }

  public onOpenDownloadQueue(): void {
    this.dialog.open(QueueComponent, {
      id: 'dlQueueDialog',
    });
  }
}

