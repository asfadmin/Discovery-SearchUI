import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { Store, Action } from '@ngrx/store';
import { AppState } from '@store';
import * as userStore from '@store/user';
import * as searchStore from '@store/search';
import * as uiStore from '@store/ui';
import * as filtersStore from '@store/filters';

import { SavedSearchService, MapService, WktService, ScreenSizeService } from '@services';
import * as models from '@models';

@Component({
  selector: 'app-saved-searches',
  templateUrl: './saved-searches.component.html',
  styleUrls: ['./saved-searches.component.scss'],
})
export class SavedSearchesComponent implements OnInit {
  @ViewChild('filterInput', { static: true }) filterInput: ElementRef;

  public searches$ = this.store$.select(userStore.getSavedSearches);
  public searchType$ = this.store$.select(searchStore.getSearchType);

  public breakpoint: models.Breakpoints;
  public breakpoints = models.Breakpoints;

  private filterTokens = [];
  private filteredSearches = new Set<string>();
  public searchFilter = '';
  public expandedSearchId: string;
  public newSearchId: string;

  constructor(
    private savedSearchService: SavedSearchService,
    private store$: Store<AppState>,
    private screenSize: ScreenSizeService,
    private mapService: MapService,
    private wktService: WktService,
  ) { }

  ngOnInit() {
    this.savedSearchService.loadSearches();
    this.screenSize.breakpoint$.subscribe(
      breakpoint => this.breakpoint = breakpoint
    );

    this.store$.select(userStore.getSavedSearches).subscribe(
      searches => {
        const filtersWithValues = searches.map(
          search => ({
            id: search.id,
            tokens: {
              name: search.name,
              searchType: search.searchType,
              ...Object.entries(search.filters).reduce(
                (acc, [key, val]) => this.addIfHasValue(acc, key, val), {}
              )
            }
          })
        ).map(search => {
          return {
            id: search.id,
            token: Object.entries(search.tokens).map(
              ([name, val]) => `${name} ${val}`
            )
              .join(' ')
              .toLowerCase()
          };
        });

        this.filterTokens = filtersWithValues;
        this.updateFilter();
      });

      this.filterInput.nativeElement.blur();
  }

  private addIfHasValue(acc, key: string, val): Object {
    if (!val) {
      return acc;
    }

    if (val.length === 0) {
      return acc;
    }

    if (Object.keys(val).length === 0) {
      return acc;
    }

    if (key === 'productTypes') {
      return {
        ...acc,
        'file types': val.map(t => t.displayName),
        'filetypes': val.map(t => t.apiValue)
      };
    }

    if (this.isRange(val)) {
      const range = <models.Range<any>>val;
      let nonNullVals = ``;

      if (val.start !== null) {
        nonNullVals += `start ${val.start} `;
      }

      if (val.end !== null) {
        nonNullVals += `end ${val.end}`;
      }

      if (nonNullVals.length === 0) {
        return acc;
      }

      return {...acc, [key]: nonNullVals};
    }

    return {...acc, [key]: val};
  }

  private isRange(val): val is models.Range<any> {
    return (
      typeof val === 'object' &&
      'start' in val &&
      'end' in val
    );
  }

  public saveCurrentSearch(): void {
    const search = this.savedSearchService.makeCurrentSearch('');

    if (!search) {
      return;
    }

    this.newSearchId = search.id;

    this.store$.dispatch(new userStore.AddNewSearch(search));
    this.savedSearchService.saveSearches();
  }

  public updateSearchFilters(id: string): void {
    this.savedSearchService.updateSearchWithCurrentFilters(id);
  }

  public onNewFilter(filter: string): void {
    this.searchFilter = filter;
    this.updateFilter();
  }

  private updateFilter(): void {
    this.filteredSearches = new Set();
    const filter = this.searchFilter.toLocaleLowerCase();

    this.filterTokens.forEach(
      search => {
        if (search.token.includes(filter)) {
          this.filteredSearches.add(search.id);
        }
      }
    );
  }

  public unfocusFilter(): void {
    this.filterInput.nativeElement.blur();
  }

  public updateSearchName(update: {id: string, name: string}): void {
    if (update.name === '') {
      update.name = '(No title)' ;
    }
    this.newSearchId = '';

    this.savedSearchService.updateSearchName(update.id, update.name);
  }

  public onClose(): void {
    this.store$.dispatch(new uiStore.CloseSidebar());
  }

  public deleteSearch(id: string): void {
    this.savedSearchService.deleteSearch(id);
  }

  public onSetSearch(search: models.Search): void {
    this.store$.dispatch(new searchStore.ClearSearch());
    this.store$.dispatch(new searchStore.SetSearchType(search.searchType));

    if (search.searchType === models.SearchType.DATASET) {
      this.loadSearchPolygon(search);
    }

    this.store$.dispatch(new filtersStore.SetSavedSearch(search));
    this.store$.dispatch(new uiStore.CloseSidebar());
    this.store$.dispatch(new searchStore.MakeSearch());
  }

  private loadSearchPolygon(search: models.Search): void {
    const polygon = (<models.GeographicFiltersType>search.filters).polygon;

    if (polygon === null) {
      this.mapService.clearDrawLayer();
    } else {
      const features =  this.wktService.wktToFeature(
        polygon,
        this.mapService.epsg()
      );

      this.mapService.setDrawFeature(features);
    }
  }

  public onExpandSearch(searchId: string): void {
    this.expandedSearchId = this.expandedSearchId === searchId ?
    '' : searchId;
  }
}
