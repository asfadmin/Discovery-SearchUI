import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Subject } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { Store, ActionsSubject } from '@ngrx/store';
import { ofType } from '@ngrx/effects';

import { AppState } from '@store';
import * as searchStore from '@store/search';
import * as userStore from '@store/user';
import * as uiStore from '@store/ui';
import * as filtersStore from '@store/filters';

import * as services from '@services';
import { SavedSearchType, SearchType } from '@models';
import { MatDialog } from '@angular/material/dialog';
import { HelpComponent } from '@components/help/help.component';

// Declare GTM dataLayer array.
declare global {
  interface Window { dataLayer: any[]; }
}

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
  public searchError$ = new Subject<void>();
  public isSearchError = false;

  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    private actions$: ActionsSubject,
    private savedSearchService: services.SavedSearchService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
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

    this.subs.add(
      this.actions$.pipe(
        ofType<searchStore.SearchError>(searchStore.SearchActionType.SEARCH_ERROR),
      ).subscribe(
        _ => this.onSearchError()
      )
    );

    this.handleSearchErrors();
  }

  public onDoSearch(): void {
    if (this.searchType === SearchType.BASELINE
    || this.searchType === SearchType.SBAS) {
      this.clearBaselineRanges();
    }

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

  private handleSearchErrors() {
    this.subs.add(
      this.searchError$.pipe(
        tap(_ => {
          this.isSearchError = true;
          this.snackBar.open('Trouble loading search results', 'SEARCH ERROR', { duration: 5000 });
        }),
        delay(820),
      ).subscribe(_ => {
        this.isSearchError = false;
      })
    );
  }

  public onSearchError(): void {
    this.searchError$.next();
  }

  private clearBaselineRanges() {
    this.store$.dispatch(new filtersStore.ClearPerpendicularRange());
    this.store$.dispatch(new filtersStore.ClearTemporalRange());
  }

  public saveCurrentSearch(): void {

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'save-current-search',
      'save-current-search': true
    });

    this.store$.dispatch(new uiStore.SetSavedSearchType(SavedSearchType.SAVED));
    this.store$.dispatch(new uiStore.OpenSidebar());
    this.store$.dispatch(new uiStore.SetSaveSearchOn(true));
  }

  public onOpenSavedSearches(): void {

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'open-saved-searches',
      'open-saved-searches': true
    });

    this.store$.dispatch(new uiStore.SetSavedSearchType(SavedSearchType.SAVED));
    this.store$.dispatch(new uiStore.OpenSidebar());
  }

  public onOpenSearchHistory(): void {

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'open-search-history',
      'open-search-history': true
    });

    this.store$.dispatch(new uiStore.SetSavedSearchType(SavedSearchType.HISTORY));
    this.store$.dispatch(new uiStore.OpenSidebar());
  }

  public onOpenHelp(helpTopic: string): void {
    this.dialog.open(HelpComponent, {
      panelClass: 'help-panel-config',
      data: { helpTopic },
      width: '80vw',
      height: '80vh',
      maxWidth: '100%',
      maxHeight: '100%',
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
