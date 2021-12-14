import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';

import { combineLatest, Subject } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { Store, ActionsSubject } from '@ngrx/store';
import { ofType } from '@ngrx/effects';

import { AppState } from '@store';
import * as searchStore from '@store/search';
import * as userStore from '@store/user';
import * as uiStore from '@store/ui';
import * as filtersStore from '@store/filters';
// import * as scenesStore from '@store/scenes';

import * as services from '@services';
import { SidebarType, SearchType } from '@models';
import { MatDialog } from '@angular/material/dialog';
import { HelpComponent } from '@components/help/help.component';
import { getFilterMaster } from '@store/scenes';
import { SaveSearchDialogComponent } from '@components/shared/save-search-dialog';

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
  public searchType: SearchType;
  public searchTypes = SearchType;
  public canSearch$ = this.store$.select(searchStore.getCanSearch);
  public isMaxResultsLoading$ = this.store$.select(searchStore.getIsMaxResultsLoading);
  public loading$ = this.store$.select(searchStore.getIsLoading);

  public areResultsOutOfDate$ = this.store$.select(searchStore.getareResultsOutOfDate);

  public isLoggedIn = false;
  public searchError$ = new Subject<void>();
  public isSearchError = false;

  private subs = new SubSink();

  private stackReferenceScene: string;
  private latestReferenceScene: string;
  private isFiltersOpen = false;
  private resultsMenuOpen = false;

  constructor(
    private store$: Store<AppState>,
    private actions$: ActionsSubject,
    private savedSearchService: services.SavedSearchService,
    // private SearchParamsService: services.SearchParamsService,
    private dialog: MatDialog,
    private notificationService: services.NotificationService,
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
      this.store$.select(uiStore.getIsResultsMenuOpen).subscribe(
        isOpen => this.resultsMenuOpen = isOpen
      )
    );

    this.subs.add(
      this.actions$.pipe(
        ofType<searchStore.SearchError>(searchStore.SearchActionType.SEARCH_ERROR),
      ).subscribe(
        _ => this.onSearchError()
      )
    );

    this.subs.add(
      this.actions$.pipe(
        ofType<searchStore.SearchError>(searchStore.SearchActionType.SET_SEARCH_TYPE)
      ).subscribe(
        _ => {
          this.stackReferenceScene = null;
          this.latestReferenceScene = null;
        }
      )
    );

    this.subs.add(
      combineLatest(this.store$.select(getFilterMaster),
      this.store$.select(uiStore.getIsFiltersMenuOpen)).subscribe(([latestFilter, isOpen]) => {
      if (isOpen && this.searchType === this.searchTypes.BASELINE || this.searchType === this.searchTypes.SBAS) {
          this.latestReferenceScene = latestFilter;
          if (this.stackReferenceScene == null || '') {
            this.stackReferenceScene = latestFilter;
          }
      }
      this.isFiltersOpen = isOpen;
      }
      )
    );

    this.handleSearchErrors();
  }

  public onDoSearch(): void {
    if (((this.searchType === this.searchTypes.SBAS || this.searchType === this.searchTypes.BASELINE ) && this.isFiltersOpen &&
      (this.stackReferenceScene !== this.latestReferenceScene || !this.resultsMenuOpen)) ||
    ((this.stackReferenceScene !== this.latestReferenceScene || !this.isFiltersOpen) &&
        (this.searchType === this.searchTypes.SBAS || this.searchType === this.searchTypes.BASELINE)) ||
        (this.searchType !== this.searchTypes.SBAS && this.searchType !== this.searchTypes.BASELINE)
      ) {

      this.store$.dispatch(new searchStore.MakeSearch());

      const search = this.savedSearchService.makeCurrentSearch(`${Date.now()}`);

      if (search) {
        this.store$.dispatch(new userStore.AddSearchToHistory(search));
        this.store$.dispatch(new userStore.SaveSearchHistory());
      }
    } else {
      this.stackReferenceScene = null;
      this.store$.dispatch(new uiStore.CloseFiltersMenu());
    }
  }

  public onClearSearch(): void {
    this.store$.dispatch(new filtersStore.ClearListFilters());
    this.store$.dispatch(new searchStore.ClearSearch());
  }

  private handleSearchErrors() {
    this.subs.add(
      this.searchError$.pipe(
        tap(_ => {
          this.isSearchError = true;
          this.notificationService.error('Trouble loading search results', 'Search Error', { timeOut: 5000 });
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

  public saveCurrentSearch(): void {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'save-current-search',
      'save-current-search': true
    });

    this.dialog.open(SaveSearchDialogComponent, {
      id: 'ConfirmProcess',
      width: '550px',
      height: '500px',
      maxWidth: '550px',
      maxHeight: '500px',
      data: { saveType: SidebarType.SAVED_SEARCHES }
    });

    this.store$.dispatch(new uiStore.OpenSidebar(SidebarType.SAVED_SEARCHES));
  }

  public saveCurrentFilters(): void {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'save-current-filters',
      'save-current-filters': true
    });

    this.dialog.open(SaveSearchDialogComponent, {
      id: 'ConfirmProcess',
      width: '550px',
      height: '500px',
      maxWidth: '550px',
      maxHeight: '500px',
      data: { saveType: SidebarType.USER_FILTERS }
    });

    this.store$.dispatch(new uiStore.OpenSidebar(SidebarType.USER_FILTERS));
  }

  public onOpenSavedSearches(): void {

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'open-saved-searches',
      'open-saved-searches': true
    });

    this.store$.dispatch(new uiStore.OpenSidebar(SidebarType.SAVED_SEARCHES));
  }

  public onOpenSavedFilters(): void {

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'open-saved-filters',
      'open-saved-filters': true
    });

    this.store$.dispatch(new uiStore.OpenSidebar(SidebarType.USER_FILTERS));
  }

  public onOpenSearchHistory(): void {

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'open-search-history',
      'open-search-history': true
    });

    this.store$.dispatch(new uiStore.OpenSidebar(SidebarType.SEARCH_HISTORY));
  }

  public onOpenHelp(helpTopic: string): void {

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'open-help',
      'open-help': helpTopic
    });

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
