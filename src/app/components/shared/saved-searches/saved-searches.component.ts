import { Component, OnInit } from '@angular/core';

import { Store, Action } from '@ngrx/store';
import { AppState } from '@store';
import * as userStore from '@store/user';
import * as searchStore from '@store/search';
import { MatDialogRef } from '@angular/material';

import { SavedSearchService } from '@services';
import * as models from '@models';

@Component({
  selector: 'app-saved-searches',
  templateUrl: './saved-searches.component.html',
  styleUrls: ['./saved-searches.component.scss']
})
export class SavedSearchesComponent {
  public searches$ = this.store$.select(userStore.getSavedSearches);
  public searchType$ = this.store$.select(searchStore.getSearchType);

  constructor(
    private savedSearchService: SavedSearchService,
    private store$: Store<AppState>,
    private dialogRef: MatDialogRef<SavedSearchesComponent>,
  ) { }

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
    this.dialogRef.close();
  }

  public deleteSearch(id: string): void {
    this.savedSearchService.deleteSearch(id);
  }
}
