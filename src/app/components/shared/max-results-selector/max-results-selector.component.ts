import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as searchStore from '@store/search';
import * as filtersStore from '@store/filters';

@Component({
  selector: 'app-max-results-selector',
  templateUrl: './max-results-selector.component.html',
  styleUrls: ['./max-results-selector.component.css']
})
export class MaxResultsSelectorComponent implements OnInit {
  public maxResults: number;
  public isMaxResultsLoading: boolean;
  public currentSearchAmount: number;

  public possibleMaxResults = [250, 1000, 10000];

  constructor(
   private store$: Store<AppState>,
  ) {}

  ngOnInit() {
    this.store$.select(filtersStore.getMaxSearchResults).subscribe(
      maxResults => this.maxResults = maxResults
    );

    this.store$.select(searchStore.getIsMaxResultsLoading).subscribe(
      isLoading => this.isMaxResultsLoading = isLoading
    );

    this.store$.select(searchStore.getSearchAmount).subscribe(
      amount => this.currentSearchAmount = amount
    );
  }

  public onNewMaxResults(maxResults: number): void {
    this.store$.dispatch(new filtersStore.SetMaxResults(maxResults));
  }

  public formatNumber(num: number): string {
    return num
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }
}
