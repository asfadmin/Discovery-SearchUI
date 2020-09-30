import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SubSink } from 'subsink';
import { switchMap, tap, delay } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as userStore from '@store/user';
import * as searchStore from '@store/search';
import * as uiStore from '@store/ui';

import { SavedSearchService, ScreenSizeService, SearchService } from '@services';
import * as models from '@models';

@Component({
  selector: 'app-saved-searches',
  templateUrl: './saved-searches.component.html',
  styleUrls: ['./saved-searches.component.scss'],
})
export class SavedSearchesComponent implements OnInit, OnDestroy {
  @ViewChild('filterInput', { static: true }) filterInput: ElementRef;

  public searchType$ = this.store$.select(searchStore.getSearchType);
  public saveSearchOn: boolean;
  public savedSearchType: models.SavedSearchType;
  public lockedFocus = false;

  public savedSearchType$ = this.store$.select(uiStore.getSaveSearchType);
  public SavedSearchType = models.SavedSearchType;
  public searches$ = this.savedSearchType$.pipe(
    switchMap(savedSearchType =>
      (savedSearchType === models.SavedSearchType.SAVED) ?
        this.store$.select(userStore.getSavedSearches) :
        this.store$.select(userStore.getSearchHistory)
    )
  );

  public breakpoint: models.Breakpoints;
  public breakpoints = models.Breakpoints;

  private filterTokens = [];
  private filteredSearches = new Set<string>();
  public searchFilter = '';
  public expandedSearchId: string;
  public newSearchId: string;

  private subs = new SubSink();

  constructor(
    private savedSearchService: SavedSearchService,
    private store$: Store<AppState>,
    private screenSize: ScreenSizeService,
    private snackBar: MatSnackBar,
    private searchService: SearchService,
  ) { }

  ngOnInit() {
    this.savedSearchService.loadSearches();

    this.subs.add(
      this.screenSize.breakpoint$.subscribe(
        breakpoint => this.breakpoint = breakpoint
      )
    );

    this.subs.add(
      this.store$.select(uiStore.getIsSaveSearchOn).pipe(
        tap(saveSearchOn => this.saveSearchOn = saveSearchOn),
        delay(250)
      ).subscribe(
        _ => {
          if (this.saveSearchOn) {
            this.lockedFocus = true;
            this.saveCurrentSearch();
            this.store$.dispatch(new uiStore.SetSaveSearchOn(false));
          }
        }
      )
    );

    this.subs.add(
      this.savedSearchType$.subscribe(
        savedSearchType => this.savedSearchType = savedSearchType
      )
    );

    this.subs.add(
      this.searches$.subscribe(
        searches => {
          this.filterTokens = this.savedSearchService.filterTokensFrom(searches);
          this.updateFilter();
        }
      )
    );
  }

  public onSavedSearchTypeChange(savedSearchType: models.SavedSearchType): void {
    this.store$.dispatch(new uiStore.SetSavedSearchType(savedSearchType));
  }

  public saveCurrentSearch(): void {
    const search = this.savedSearchService.makeCurrentSearch('');

    if (!this.searchCanBeSaved(search)) {
      return;
    }

    this.newSearchId = search.id;

    this.store$.dispatch(new userStore.AddNewSearch(search));
    this.savedSearchService.saveSearches();
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
    this.snackBar.open(
      `${strType} too long, must be under 10,000 characters to save (${len.toLocaleString()})`, `ERROR`,
      { duration: 6000, }
    );
  }

  public updateSearchFilters(id: string): void {
    this.savedSearchService.updateSearchWithCurrentFilters(id);
  }

  public onNewFilter(filterStr: string): void {
    this.searchFilter = filterStr;
    this.updateFilter();
  }

  private updateFilter(): void {
    this.filteredSearches = new Set();
    const filterStr = this.searchFilter.toLocaleLowerCase();

    this.filterTokens.forEach(
      search => {
        if (search.token.includes(filterStr)) {
          this.filteredSearches.add(search.id);
        }
      }
    );
  }

  public unfocusFilter(): void {
    this.filterInput.nativeElement.blur();
  }

  public updateSearchName(update: {id: string, name: string}): void {
    if (update.name === '') {
      update.name = '(No title)' ;
    }
    this.newSearchId = '';

    this.savedSearchService.updateSearchName(update.id, update.name);
  }

  public onClose(): void {
    this.store$.dispatch(new uiStore.CloseSidebar());
  }

  public deleteSearch(id: string): void {
    this.savedSearchService.deleteSearch(id);
  }

  public onSetSearch(search: models.Search): void {
    this.searchService.load(search);
  }


  public onUnlockFocus(): void {
    this.lockedFocus = false;
  }

  public onExpandSearch(searchId: string): void {
    this.expandedSearchId = this.expandedSearchId === searchId ?
    '' : searchId;
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
