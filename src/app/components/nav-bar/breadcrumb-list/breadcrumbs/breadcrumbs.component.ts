import { Component, OnInit } from '@angular/core';

import { Store, ActionsSubject } from '@ngrx/store';
import { ofType } from '@ngrx/effects';

import { AppState } from '@store';
import * as searchStore from '@store/search';
import * as uiStore from '@store/ui';

import * as models from '@models';

enum BreadcrumbFilterType {
  SEARCH_TYPE = 'Search Type',
  DATASET = 'Dataset',
  DATE = 'Date',
  AOI = 'Area of Interest',
  PATH_FRAME = 'Path/Frame',
  ADDITIONAL = 'Additional Filters',
  FILTERS_MENU = '...',
  NONE = 'None'
}

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit {

  public filterTypes = BreadcrumbFilterType;
  public selectedFilter = BreadcrumbFilterType.NONE;

  public searchTypes = models.SearchType;
  public searchType: models.SearchType = models.SearchType.DATASET;

  constructor(
    private store$: Store<AppState>,
    private actions$: ActionsSubject,
  ) { }

  ngOnInit() {
    this.store$.select(uiStore.getSearchType).subscribe(
      searchType => this.searchType = searchType
    );

    this.actions$.pipe(
      ofType<searchStore.MakeSearch>(searchStore.SearchActionType.MAKE_SEARCH),
    ).subscribe(
      _ => this.onSearch()
    );
  }

  public onSetSearchType(searchType: models.SearchType): void {
    this.clearSelectedBreadcrumb();
    this.store$.dispatch(new searchStore.ClearSearch());
    this.store$.dispatch(new uiStore.SetSearchType(searchType));
  }

  public onToggleFiltersMenu(): void {
    this.store$.dispatch(new uiStore.ToggleFiltersMenu());
    this.selectedFilter = BreadcrumbFilterType.NONE;
  }

  public onNewSelectedFilter(filterType: BreadcrumbFilterType): void {
    this.selectedFilter = this.selectedFilter === filterType ?
      BreadcrumbFilterType.NONE : filterType;

    this.store$.dispatch(new uiStore.CloseFiltersMenu());
  }

  public clearSelectedBreadcrumb(): void {
    this.store$.dispatch(new uiStore.CloseFiltersMenu());
    this.selectedFilter = BreadcrumbFilterType.NONE;
  }

  public onSearch(): void {
    this.clearSelectedBreadcrumb();
  }
}
