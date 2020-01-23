import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Store, Action } from '@ngrx/store';
import { filter, map, skip, tap, withLatestFrom, switchMap } from 'rxjs/operators';
import * as uuid from 'uuid/v1';

import { MapService } from './map/map.service';
import { AppState } from '@store';
import * as filtersStore from '@store/filters';
import { getSearchType } from '@store/search/search.reducer';
import {
  AddNewSearch, UpdateSearchWithFilters, UpdateSearchName, DeleteSavedSearch,
  SaveSearches, LoadSavedSearches
} from '@store/user/user.action';

import * as models from '@models';


@Injectable({
  providedIn: 'root'
})
export class SavedSearchService {

  private currentGeographicSearch$ = this.store$.select(filtersStore.getGeographicSearch).pipe(
    map(filters =>  ({ ...filters, flightDirections: Array.from(filters.flightDirections) })),
    withLatestFrom(this.mapService.searchPolygon$),
    map(([filters, polygon]): models.GeographicFiltersType => ({
      ...filters,
      polygon
    }))
  );

  private currentListSearch$ = this.store$.select(filtersStore.getListSearch);
  private searchType$ = this.store$.select(getSearchType);

  public currentSearch$ = this.searchType$.pipe(
    switchMap(searchType => searchType === models.SearchType.DATASET ?
      this.currentGeographicSearch$ :
      this.currentListSearch$
    )
  );
  private currentSearch: models.FilterType;
  private searchType: models.SearchType;

  constructor(
    private store$: Store<AppState>,
    private mapService: MapService,
    private snackBar: MatSnackBar,
  ) {
    this.currentSearch$.subscribe(
      current => this.currentSearch = current
    );

    this.searchType$.subscribe(
      searchType => this.searchType = searchType
    );
  }

  public makeCurrentSearch(searchName: string): models.Search {
    const maxLen = 10000;

    if (this.searchType === models.SearchType.DATASET) {
      const filters = <models.GeographicFiltersType>this.currentSearch;
      const len = filters.polygon.length;

      if (len > maxLen) {
        this.notifyUserListTooLong(len, 'List');
        return;
      }
    } else if (this.searchType === models.SearchType.LIST) {
      const filters = <models.ListFiltersType>this.currentSearch;
      const len = filters.list.join(',').length;

      if (len > maxLen) {
        this.notifyUserListTooLong(len, 'List');
        return;
      }
    }

    return {
      name: searchName,
      id: uuid(),
      filters: this.currentSearch,
      searchType: this.searchType,
    };
  }

  private notifyUserListTooLong(len: number, strType: string): void {
    this.snackBar.open(
      `${strType} too long, must be under 10,000 charecters (${len.toLocaleString()})`, `ERROR`,
      { duration: 4000, }
    );
  }

  public updateSearchWithCurrentFilters(id: string): void {
    const action = new UpdateSearchWithFilters({
      id, filters: <models.GeographicFiltersType>this.currentSearch
    });

    this.store$.dispatch(action);
    this.saveSearches();
  }

  public updateSearchName(id: string, name: string): void {
    const action = new UpdateSearchName({ id, name });

    this.store$.dispatch(action);
    this.saveSearches();
  }

  public deleteSearch(id: string): void {
    const action = new DeleteSavedSearch(id);

    this.store$.dispatch(action);
    this.saveSearches();
  }

  public saveSearches(): void {
    const action = new SaveSearches();
    this.store$.dispatch(action);
  }

  public loadSearches(): void {
    const action = new LoadSavedSearches();
    this.store$.dispatch(action);
  }
}
