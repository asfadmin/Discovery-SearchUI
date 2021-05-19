import { Component, OnDestroy, OnInit } from '@angular/core';
import { SearchType } from '@models';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as filtersStore from '@store/filters';
import * as searchStore from '@store/search';
import * as uiStore from '@store/ui';
import { SubSink } from 'subsink';
@Component({
  selector: 'app-cancel-filter-changes',
  templateUrl: './cancel-filter-changes.component.html',
  styleUrls: ['./cancel-filter-changes.component.scss']
})
export class CancelFilterChangesComponent implements OnInit, OnDestroy {

  private searchType$ = this.store$.select(searchStore.getSearchType);
  private searchType: SearchType;
  private subs = new SubSink();

  constructor(private store$: Store<AppState>) {
   }

  ngOnInit(): void {
    this.subs.add(
        this.searchType$.subscribe(
          currentSearchType => this.searchType = currentSearchType
        )
      );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  public onCancelFiltersChange(): void {
    if (this.searchType === SearchType.LIST) {
      this.store$.dispatch(new filtersStore.ClearListFilters());
    }

    this.store$.dispatch(new filtersStore.RestoreFilters());
    this.store$.dispatch(new filtersStore.StoreCurrentFilters());
    this.store$.dispatch(new uiStore.CloseFiltersMenu());

  }

}
