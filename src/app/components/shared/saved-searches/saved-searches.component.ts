import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { Store, Action } from '@ngrx/store';
import { AppState } from '@store';
import * as userStore from '@store/user';
import * as searchStore from '@store/search';
import * as uiStore from '@store/ui';
import * as filtersStore from '@store/filters';

import { SavedSearchService } from '@services';
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

  private toFilter: string[] = [];
  public searchFilter = '';
  public expandedSearchId: string;
  public newSearchId: string;

  constructor(
    private savedSearchService: SavedSearchService,
    private store$: Store<AppState>,
  ) { }

  ngOnInit() {
    this.savedSearchService.loadSearches();

    this.store$.select(userStore.getSavedSearches).subscribe(
      searches => {
        const filtersWithValues = searches.map(
          search => ({
            id: search.id,
            tokens: {
              name: search.name,
              searchType: search.searchType,
              filters: Object.entries(search.filters).reduce(
                (acc, [key, val]) => this.addIfHasValue(acc, key, val), {}
              )
            }
          })
        );

        console.log(filtersWithValues);
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

    if (this.isRange(val)) {
      const range = <models.Range<any>>val;
      const nonNullVals: any = {};

      if (val.start !== null) {
        nonNullVals.start = val.start;
      }

      if (val.end !== null) {
        nonNullVals.end = val.end;
      }

      if (Object.keys(nonNullVals).length === 0) {
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

    this.newSearchId = search.id;

    this.store$.dispatch(new userStore.AddNewSearch(search));
    this.savedSearchService.saveSearches();
  }

  public updateSearchFilters(id: string): void {
    this.savedSearchService.updateSearchWithCurrentFilters(id);
  }

  public onNewFilter(filter: string): void {
    this.updateFilter(filter);
  }

  private updateFilter(filter: string): void {

  }

  public unfocusFilter(): void {
    this.filterInput.nativeElement.blur();
  }

  public updateSearchName(update: {id: string, name: string}): void {
    if (update.name === '') {
      update.name = '(No title)' ;
    }

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
    this.store$.dispatch(new filtersStore.SetSavedSearch(search));
    this.store$.dispatch(new uiStore.CloseSidebar());
  }

  public onExpandSearch(searchId: string): void {
    this.expandedSearchId = this.expandedSearchId === searchId ?
    '' : searchId;
  }
}
