import { Component, OnInit } from '@angular/core';

import { Store, Action } from '@ngrx/store';
import { AppState } from '@store';
import * as userStore from '@store/user';
import { MatDialogRef } from '@angular/material';

import { SavedSearchService } from '@services';

@Component({
  selector: 'app-saved-searches',
  templateUrl: './saved-searches.component.html',
  styleUrls: ['./saved-searches.component.scss']
})
export class SavedSearchesComponent implements OnInit {

  public searches$ = this.store$.select(userStore.getSavedSearches);

  constructor(
    private savedSearchService: SavedSearchService,
    private store$: Store<AppState>,
    private dialogRef: MatDialogRef<SavedSearchesComponent>,
  ) { }

  ngOnInit() {
  }

  public saveCurrentSearch(): void {
    this.savedSearchService.addCurrentSearch('New Search');
  }

  public onClose(): void {
    this.dialogRef.close();
  }
}
