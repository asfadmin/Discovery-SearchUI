import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {v1 as uuid} from 'uuid';

import { combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as searchStore from '@store/search';
import * as filterStore from '@store/filters';
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

  private currentFiltersBySearchType = {};
  public searchType: models.SearchType;

  public saveName: string;
  public isNameError = false;

  public saveType: models.SidebarType;
  public saveTypeName: string;

  constructor(
    public dialogRef: MatDialogRef<SaveSearchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private store$: Store<AppState>,
    private savedSearchService: SavedSearchService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.saveType = this.data.saveType;
    if (this.saveType === models.SidebarType.SAVED_SEARCHES) {
      this.saveTypeName = 'Save Search';

      this.store$.select(filterStore.getGeocodeArea).pipe(take(1)).subscribe(geocode => {
        this.search = this.savedSearchService.makeCurrentSearch(geocode ?? '');
        this.saveName = geocode;

        if (!this.searchCanBeSaved(this.search)) {
          this.onCancelSave();
        }
      })
    }

    if (this.saveType === models.SidebarType.USER_FILTERS) {
      this.saveTypeName = 'Save Filters';

      combineLatest([
        this.store$.select(filterStore.getGeographicSearch).pipe(
          map(preset => ({... preset, flightDirections: Array.from(preset.flightDirections)}))
        ),
        this.store$.select(filterStore.getListSearch),
        this.store$.select(filterStore.getBaselineSearch),
        this.store$.select(filterStore.getSbasSearch),
        this.store$.select(searchStore.getSearchType)
      ])
        .subscribe(([geo, list, baseline, sbas, searchType]) => {
          this.currentFiltersBySearchType[models.SearchType.DATASET] = geo;
          this.currentFiltersBySearchType[models.SearchType.LIST] = list;
          this.currentFiltersBySearchType[models.SearchType.BASELINE] = baseline;
          this.currentFiltersBySearchType[models.SearchType.SBAS] = sbas;
          this.searchType = searchType;

          this.search = this.newFilterPreset();
        });
    }
  }

  public newFilterPreset() {
    const id = uuid() as string;
    return {
      name: this.saveName,
      id,
      filters: this.currentFiltersBySearchType[this.searchType],
      searchType: this.searchType
    } as models.SavedFilterPreset;
  }


  public onSaveNameChange(event: Event): void {
    const htmlEvent = event.target as HTMLInputElement;
    this.saveName = htmlEvent.value;
  }

  public onSaveNameInput(event: Event): void {
    const htmlEvent = event.target as HTMLInputElement;
    this.saveName = htmlEvent.value;
  }

  public onCancelSave(): void {
    this.store$.dispatch(new uiStore.CloseSidebar());
    this.dialogRef.close();
  }

  public onSubmitSave(): void {
    if (this.saveType === models.SidebarType.SAVED_SEARCHES) {
      this.store$.dispatch(new userStore.AddNewSearch({
        ...this.search, name: this.saveName
      }));
      this.savedSearchService.saveSearches();

    }

    if (this.saveType === models.SidebarType.USER_FILTERS) {
      this.store$.dispatch(new userStore.AddNewFiltersPreset({
        ...this.search, name: this.saveName
      }));
      this.store$.dispatch(new userStore.SaveFilters());
    }

    const addName = ` as '${this.saveName}'`;
    this.notificationService.info(
      `Saved current ${this.search.searchType}${this.saveName ? addName : ''}`
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
