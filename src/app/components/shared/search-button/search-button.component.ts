import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as searchStore from '@store/search';


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
  ) { }

  ngOnInit() {
  }

  public onDoSearch(): void {
    this.store$.dispatch(new searchStore.MakeSearch());
  }
}
