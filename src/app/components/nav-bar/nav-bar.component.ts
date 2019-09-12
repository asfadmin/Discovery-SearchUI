import { Component, OnInit, EventEmitter, Output, ViewChild, Input } from '@angular/core';

import { tap, map, filter, delay } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';
import { Store, ActionsSubject } from '@ngrx/store';
import { ofType } from '@ngrx/effects';

import { AppState } from '@store';
import * as searchStore from '@store/search';
import * as uiStore from '@store/ui';
import * as queueStore from '@store/queue';

import { MapService, WktService, LegacyAreaFormatService } from '@services';

import { MatDialog } from '@angular/material/dialog';
import { QueueComponent } from '@components/nav-bar/queue';

import * as models from '@models/index';
import * as filtersStore from '@store/filters';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],

})
export class NavBarComponent implements OnInit {
  @Input() isLoading: boolean;

  public searchType: models.SearchType = models.SearchType.DATASET;
  public searchTypes = models.SearchType;

  public queuedProducts$ = this.store$.select(queueStore.getQueuedProducts);

  constructor(
    private store$: Store<AppState>,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.store$.select(uiStore.getSearchType).subscribe(
      searchType => this.searchType = searchType
    );
  }

  public onClearSearch(): void {
    this.store$.dispatch(new searchStore.ClearSearch());
  }

  public onOpenDownloadQueue(): void {
    this.dialog.open(QueueComponent, {
      id: 'dlQueueDialog',
    });
  }

  private productType$() {
    return this.store$.select(filtersStore.getProductTypes).pipe(
      map(types => types.map(type => type.apiValue)),
      map(
        types => Array.from(new Set(types))
          .join(',')
      ),
      map(types => ({ processinglevel: types }))
    );
  }


  public onToggleFiltersMenu(): void {
    this.store$.dispatch(new uiStore.ToggleFiltersMenu());
  }
}

