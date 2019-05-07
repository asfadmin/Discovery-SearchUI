import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { interval, Subject, Subscription } from 'rxjs';
import { map, takeUntil, tap, delay, take } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as filtersStore from '@store/filters';
import * as queueStore from '@store/queue';
import * as mapStore from '@store/map';
import * as searchStore from '@store/search';
import * as uiStore from '@store/ui';
import * as granulesStore from '@store/granules';

import * as models from '@models';
import * as services from '@services';

enum BreadcrumbFilterType {
  DATASET = 'Dataset',
  DATE = 'Date',
  AOI = 'Area of Interest',
  PATH_FRAME = 'Path/Frame',
  ADDITIONAL = 'Additional Filters',
  NONE = 'None'
}

@Component({
  selector: 'app-breadcrumb-list',
  templateUrl: './breadcrumb-list.component.html',
  styleUrls: ['./breadcrumb-list.component.scss']
})
export class BreadcrumbListComponent {
  @Output()  doSearch = new EventEmitter<void>();

  constructor(private store$: Store<AppState>) { }

  public filterTypes = BreadcrumbFilterType;
  public selectedFilter = BreadcrumbFilterType.NONE;

  public areProductsLoaded$ = this.store$.select(granulesStore.getAreProductsLoaded);
  public isFiltersMenuOpen$ = this.store$.select(uiStore.getIsFiltersMenuOpen);

  public loading$ = this.store$.select(searchStore.getIsLoading);
  public searchType$ = this.store$.select(uiStore.getSearchType);
  public searchTypes = models.SearchType;

  public onDoSearch(): void {
    this.doSearch.emit();
  }
}
