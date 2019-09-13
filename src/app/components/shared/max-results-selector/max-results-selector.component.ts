import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as searchStore from '@store/search';
import * as filtersStore from '@store/filters';
import * as uiStore from '@store/ui';
import * as granulesStore from '@store/granules';

import * as models from '@models';
import { ApiLinkDialogComponent } from './api-link-dialog/api-link-dialog.component';

@Component({
  selector: 'app-max-results-selector',
  templateUrl: './max-results-selector.component.html',
  styleUrls: ['./max-results-selector.component.css']
})
export class MaxResultsSelectorComponent implements OnInit {
  public maxResults: number;
  public isMaxResultsLoading: boolean;
  public currentSearchAmount: number;
  public searchType$ = this.store$.select(uiStore.getSearchType);
  public searchTypes = models.SearchType;
  public areResultsLoaded = false;

  public possibleMaxResults = [250, 1000, 5000];

  constructor(
    private store$: Store<AppState>,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.store$.select(granulesStore.getAreResultsLoaded).subscribe(
      areLoaded => this.areResultsLoaded = areLoaded
    );

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

    if (this.areResultsLoaded) {
      this.store$.dispatch(new searchStore.MakeSearch());
    }
  }

  public onMoreResults(): void {
    const dialogRef = this.dialog.open(ApiLinkDialogComponent , {
      width: '550px', height: '700px', minHeight: '50%'
    });
  }


  public formatNumber(num: number): string {
    return num
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }
}
