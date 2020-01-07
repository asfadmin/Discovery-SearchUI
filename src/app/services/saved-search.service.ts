import { Injectable } from '@angular/core';

import { Store, Action } from '@ngrx/store';
import { filter, map, skip, tap, withLatestFrom, switchMap } from 'rxjs/operators';
import * as uuid from 'uuid/v1';

import { MapService } from './map/map.service';
import { AppState } from '@store';
import * as filtersStore from '@store/filters';
import { getSearchType } from '@store/search/search.reducer';
import { AddNewSearch, UpdateSearchWithFilters, UpdateSearchListFilters  } from '@store/user/user.action';

import * as models from '@models';


@Injectable({
  providedIn: 'root'
})
export class SavedSearchService {

  private currentGeographicSearch$ = this.store$.select(filtersStore.getGeographicSearch).pipe(
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
  ) {
    this.currentSearch$.subscribe(
      current => this.currentSearch = current
    );

    this.searchType$.subscribe(
      searchType => this.searchType = searchType
    );
  }

  public addCurrentSearch(searchName: string): void {
    const search = {
      name: searchName,
      id: uuid(),
      filters: this.currentSearch,
      searchType: this.searchType,
    };

    this.store$.dispatch(new AddNewSearch(search));
  }

  public updateSearchWithCurrentFilters(id: string): void {
    const action = new UpdateSearchWithFilters({ id, filters: <models.GeographicFiltersType>this.currentSearch });

    this.store$.dispatch(action);
  }
}
