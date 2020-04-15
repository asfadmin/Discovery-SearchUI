import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';

import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as searchStore from '@store/search';
import * as userStore from '@store/user';
import * as uiStore from '@store/ui';
import * as filtersStore from '@store/filters';

import * as services from '@services';
import { SavedSearchType, SearchType } from '@models';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { HelpComponent } from '@components/help/help.component';


@Component({
  selector: 'app-search-button',
  templateUrl: './search-button.component.html',
  styleUrls: ['./search-button.component.scss']
})
export class SearchButtonComponent implements OnInit, OnDestroy {
  @Output() doSearch = new EventEmitter<void>();

  public searchType: SearchType;
  public canSearch$ = this.store$.select(searchStore.getCanSearch);
  public isMaxResultsLoading$ = this.store$.select(searchStore.getIsMaxResultsLoading);
  public loading$ = this.store$.select(searchStore.getIsLoading);
  public isLoggedIn = false;
  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    private savedSearchService: services.SavedSearchService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.subs.add(
      this.store$.select(userStore.getIsUserLoggedIn).subscribe(
        isLoggedIn => this.isLoggedIn = isLoggedIn
      )
    );

    this.subs.add(
      this.store$.select(searchStore.getSearchType).subscribe(
        searchType => this.searchType = searchType
      )
    );
  }

  public onDoSearch(): void {
    this.clearBaselineRanges();
    this.store$.dispatch(new searchStore.MakeSearch());

    const search = this.savedSearchService.makeCurrentSearch(`${Date.now()}`);

    if (search) {
      this.store$.dispatch(new userStore.AddSearchToHistory(search));
      this.store$.dispatch(new userStore.SaveSearchHistory());
    }
  }

  public onClearSearch(): void {
    this.store$.dispatch(new searchStore.ClearSearch());
  }

  private clearBaselineRanges() {
    this.store$.dispatch(new filtersStore.ClearPerpendicularRange());
    this.store$.dispatch(new filtersStore.ClearTemporalRange());
  }

  public saveCurrentSearch(): void {
    this.store$.dispatch(new uiStore.SetSavedSearchType(SavedSearchType.SAVED));
    this.store$.dispatch(new uiStore.OpenSidebar());
    this.store$.dispatch(new uiStore.SetSaveSearchOn(true));
  }

  public onOpenSavedSearches(): void {
    this.store$.dispatch(new uiStore.SetSavedSearchType(SavedSearchType.SAVED));
    this.store$.dispatch(new uiStore.OpenSidebar());
  }

  public onOpenSearchHistory(): void {
    this.store$.dispatch(new uiStore.SetSavedSearchType(SavedSearchType.HISTORY));
    this.store$.dispatch(new uiStore.OpenSidebar());
  }

  public onOpenHelp(helpSelection: string): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.panelClass = 'help-panel-config';
    dialogConfig.data = {helpTopic: helpSelection};
    dialogConfig.width = '80vw';
    dialogConfig.height = '80vh';
    dialogConfig.maxWidth = '100%';
    dialogConfig.maxHeight = '100%';

    const dialogRef = this.dialog.open(HelpComponent, dialogConfig);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
