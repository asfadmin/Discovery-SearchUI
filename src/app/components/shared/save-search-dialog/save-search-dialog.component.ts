import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as userStore from '@store/user';
import * as uiStore from '@store/ui';

import { SavedSearchService, NotificationService } from '@services';
import * as models from '@models';

@Component({
  selector: 'app-save-search-dialog',
  templateUrl: './save-search-dialog.component.html',
  styleUrls: ['./save-search-dialog.component.scss']
})
export class SaveSearchDialogComponent implements OnInit {
  public search: models.Search;
  public searchName: string;
  public isNameError = false;

  constructor(
    public dialogRef: MatDialogRef<SaveSearchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private store$: Store<AppState>,
    private savedSearchService: SavedSearchService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.search = this.savedSearchService.makeCurrentSearch('');

    if (!this.searchCanBeSaved(this.search)) {
      this.onCancelSave();
    }
  }

  public onSearchNameChange(event: Event): void {
    // TODO: error checking here
    const htmlEvent = event.target as HTMLInputElement;
    this.searchName = htmlEvent.value;
  }

  public onSearchNameInput(event: Event): void {
    // TODO: error checking here
    const htmlEvent = event.target as HTMLInputElement;
    this.searchName = htmlEvent.value;
  }

  public onCancelSave(): void {
    this.store$.dispatch(new uiStore.CloseSidebar());
    this.dialogRef.close();
  }

  public onSubmitSave(): void {
    this.store$.dispatch(new userStore.AddNewSearch({
      ...this.search, name: this.searchName
    }));
    this.savedSearchService.saveSearches();

    const addName = ` as '${this.searchName}'`;
    this.notificationService.info(
      `Saved current ${this.search.searchType}${this.searchName ? addName : ''}`
    );

    this.dialogRef.close();
  }

  private searchCanBeSaved(search: models.Search): boolean {
    const maxLen = 10000;

    if (search.searchType === models.SearchType.DATASET) {
      const filters = <models.GeographicFiltersType>search.filters;
      const len = filters.polygon !== null ? filters.polygon.length : 0;

      if (len > maxLen) {
        this.notifyUserListTooLong(len, 'Polygon');
        return false;
      }
    } else if (search.searchType === models.SearchType.LIST) {
      const filters = <models.ListFiltersType>search.filters;
      const len = filters.list.join(',').length;

      if (len > maxLen) {
        this.notifyUserListTooLong(len, 'List');
        return false;
      }
    }

    return true;
  }

  private notifyUserListTooLong(len: number, strType: string): void {
    this.notificationService.error(
      `${strType} too long, must be under 10,000 characters to save (${len.toLocaleString()})`, `ERROR`,
      { timeOut: 6000, }
    );
  }

}
