import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as searchStore from '@store/search';
import * as userStore from '@store/user';
import * as services from '@services';


@Component({
  selector: 'app-search-button',
  templateUrl: './search-button.component.html',
  styleUrls: ['./search-button.component.css']
})
export class SearchButtonComponent implements OnInit {
  @Output() doSearch = new EventEmitter<void>();

  public canSearch$ = this.store$.select(searchStore.getCanSearch);
  public isMaxResultsLoading$ = this.store$.select(searchStore.getIsMaxResultsLoading);
  public loading$ = this.store$.select(searchStore.getIsLoading);

  constructor(
    private store$: Store<AppState>,
    private savedSearchService: services.SavedSearchService
  ) { }

  ngOnInit() {
  }

  public onDoSearch(): void {
    this.store$.dispatch(new searchStore.MakeSearch());
    const search = this.savedSearchService.makeCurrentSearch(`${Date.now()}`);

    if (search) {
      this.store$.dispatch(new userStore.AddSearchToHistory(search));
      this.store$.dispatch(new userStore.SaveSearchHistory());
    }
  }
}
