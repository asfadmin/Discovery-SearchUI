import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as uiStore from '@store/ui';

import * as models from '@models';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  @Output() newSearchType = new EventEmitter<models.SearchType>();

  public searchTypes = models.SearchType;
  public searchType$ = this.store$.select(uiStore.getSearchType);
  public selectedSearchType: models.SearchType;

  constructor(
    private store$: Store<AppState>,
  ) { }

  ngOnInit() {
    this.searchType$.subscribe(
      searchType => this.selectedSearchType = searchType
    );
  }

  public onSetSearchType(searchType: models.SearchType): void {
    this.newSearchType.emit(searchType);
  }
}
