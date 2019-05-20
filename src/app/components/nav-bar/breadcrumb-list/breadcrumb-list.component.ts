import { Component, EventEmitter, Output } from '@angular/core';

import { combineLatest } from 'rxjs';
import { tap, map, filter, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as searchStore from '@store/search';
import * as uiStore from '@store/ui';
import * as granulesStore from '@store/granules';
import * as filtersStore from '@store/filters';

import { SearchType } from '@models';
import { MapService } from '@services';


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
  selector: 'app-breadcrumb-list',
  templateUrl: './breadcrumb-list.component.html',
  styleUrls: ['./breadcrumb-list.component.scss']
})
export class BreadcrumbListComponent {
  @Output() doSearch = new EventEmitter<void>();
  @Output() clearSearch = new EventEmitter<void>();

  public accent = 'primary';
  public canSearch$ = this.store$.select(searchStore.getCanSearch);

  public filterTypes = BreadcrumbFilterType;
  public selectedFilter = BreadcrumbFilterType.NONE;

  public areProductsLoaded$ = this.store$.select(granulesStore.getAreProductsLoaded);
  public isFiltersMenuOpen$ = this.store$.select(uiStore.getIsFiltersMenuOpen);
  public searchAmount$ = this.store$.select(searchStore.getSearchAmount);

  public loading$ = this.store$.select(searchStore.getIsLoading);
  public searchType$ = this.store$.select(uiStore.getSearchType);
  public searchTypes = SearchType;

  public maxResults$ = this.store$.select(filtersStore.getMaxSearchResults);
  public currentSearchAmount$ = this.store$.select(searchStore.getSearchAmount);

  public selectedPlatformName$ = this.store$.select(filtersStore.getSelectedPlatformName);

  public isAnyDateValues$ = this.store$.select(filtersStore.getIsAnyDateValues);
  public dateRangePreview$ = this.store$.select(filtersStore.getDatePreviewStr);

  public isAnyAOIValue$ = this.mapService.searchPolygon$.pipe(
    map(polygon => !!polygon)
  );

  public isAnyAdditionalFilters$ = combineLatest(
    this.store$.select(filtersStore.getIsAnyPathFrameValue),
    this.store$.select(filtersStore.getIsAnyAdditionalFilters)
  ).pipe(
    map(additional => additional.some(v => !!v))
  );

  public additionalFiltersPreview$ = this.store$.select(filtersStore.getNumberOfAdditionalFilters).pipe(
    map(amt => amt > 0 ? ` · ${amt}` : '')
  );

  constructor(
    private store$: Store<AppState>,
    private mapService: MapService,
  ) {}

  public onDoSearch(): void {
    this.clearSelectedBreadcrumb();
    this.doSearch.emit();
  }

  public onClearSearch(): void {
    this.clearSelectedBreadcrumb();
    this.clearSearch.emit();
  }

  public clearSelectedBreadcrumb(): void {
    this.store$.dispatch(new uiStore.CloseFiltersMenu());
    this.selectedFilter = BreadcrumbFilterType.NONE;
  }

  public onClearDateRange(): void {
    this.store$.dispatch(new filtersStore.ClearDateRange());
    this.store$.dispatch(new filtersStore.ClearSeason());
  }

  public onNewSelectedFilter(filterType: BreadcrumbFilterType): void {
    this.selectedFilter = this.selectedFilter === filterType ?
      BreadcrumbFilterType.NONE : filterType;

    this.store$.dispatch(new uiStore.CloseFiltersMenu());
  }

  public onToggleFiltersMenu(): void {
    this.store$.dispatch(new uiStore.ToggleFiltersMenu());
    this.selectedFilter = BreadcrumbFilterType.NONE;
  }

  public onSetSearchType(searchType: SearchType): void {
    this.store$.dispatch(new uiStore.SetSearchType(searchType));
    this.clearSelectedBreadcrumb();
  }

  public onNewMaxResults(maxResults: number): void {
    this.store$.dispatch(new filtersStore.SetMaxResults(maxResults));
  }
}
