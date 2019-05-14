import { Component, EventEmitter, Output } from '@angular/core';

import { tap, map, filter, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as searchStore from '@store/search';
import * as mapStore from '@store/map';
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

  constructor(
    private store$: Store<AppState>,
    private mapService: MapService,
  ) { }

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

  public isAnyDateValues$ = this.store$.select(filtersStore.getIsAnyDateValues);
  public dateRangePreview$ = this.store$.select(filtersStore.getDateRange).pipe(
    map(({ start, end }) => {
      const format = date => {
        const [month, day, year] = [
          date.getUTCMonth() + 1,
          date.getUTCDate(),
          date.getUTCFullYear(),
        ];

        return `${month}-${day}-${year}`;
      };

      return [start, end]
        .filter(v => !!v)
        .map(format)
        .join(' to ');
    })
  );

  public isAnyAOIValue$ = this.mapService.searchPolygon$.pipe(
    map(polygon => !!polygon)
  );

  public isAnyPathFrameValue$ = this.store$.select(filtersStore.getIsAnyPathFrameValue);
  public pathFramePreview$ = this.store$.select(filtersStore.getPathFrameRanges).pipe(
    map(({frameRange, pathRange}) => {

      const frameRangeStr = frameRange.start || frameRange.end ?
        `(${frameRange.start || ''}, ${frameRange.end || ''})` :
        'Frame';

      const pathRangeStr = pathRange.start || pathRange.end ?
        `(${pathRange.start || ''}, ${pathRange.end || ''})` :
        'Path';

      return `${pathRangeStr}/${frameRangeStr}`;
    })
  );

  public onDoSearch(): void {
    this.doSearch.emit();
    this.selectedFilter = BreadcrumbFilterType.NONE;
  }

  public onClearSearch(): void {
    this.clearSearch.emit();
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
    this.selectedFilter = BreadcrumbFilterType.NONE;
  }

  public onNewMaxResults(maxResults: number): void {
    this.store$.dispatch(new filtersStore.SetMaxResults(maxResults));
  }
}
