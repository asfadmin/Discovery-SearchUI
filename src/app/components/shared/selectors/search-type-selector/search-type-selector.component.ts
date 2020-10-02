import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as searchStore from '@store/search';
import * as userStore from '@store/user';

import * as models from '@models';

// Declare GTM dataLayer array.
declare global {
  interface Window { dataLayer: any[]; }
}

@Component({
  selector: 'app-search-type-selector',
  templateUrl: './search-type-selector.component.html',
  styleUrls: ['./search-type-selector.component.css']
})
export class SearchTypeSelectorComponent implements OnInit, OnDestroy {
  public searchType: models.SearchType = models.SearchType.DATASET;

  public isLoggedIn = false;
  public searchTypes = models.SearchType;
  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
  ) { }

  ngOnInit() {
    this.subs.add(
      this.store$.select(searchStore.getSearchType).subscribe(
        searchType => this.searchType = searchType
      )
    );

    this.subs.add(
      this.store$.select(userStore.getIsUserLoggedIn).subscribe(
        isLoggedIn => this.isLoggedIn = isLoggedIn
      )
    );
  }

  public onSetSearchType(searchType: models.SearchType): void {
    window.dataLayer.push({
      'event': 'search-type-selected',
      'search-type': searchType
    });
    this.store$.dispatch(new searchStore.ClearSearch());
    this.store$.dispatch(new searchStore.SetSearchType(searchType));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
