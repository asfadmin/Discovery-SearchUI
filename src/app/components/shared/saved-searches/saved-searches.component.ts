import { Component, OnInit } from '@angular/core';

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
  public searches$ = this.store$.select(userStore.getSavedSearches);
  public searchType$ = this.store$.select(searchStore.getSearchType);

  public expandedSearchId: string;

  constructor(
    private savedSearchService: SavedSearchService,
    private store$: Store<AppState>,
  ) { }

  ngOnInit() {
    this.savedSearchService.loadSearches();
  }

  public saveCurrentSearch(): void {
    this.savedSearchService.addCurrentSearch('New Search');
  }

  public updateSearchFilters(id: string): void {
    this.savedSearchService.updateSearchWithCurrentFilters(id);
  }

  public updateSearchName(update: {id: string, name: string}): void {
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
