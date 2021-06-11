import { Component, OnInit } from '@angular/core';
import { Search } from '@models';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as userStore from '@store/user';
import { map, tap } from 'rxjs/operators';
@Component({
  selector: 'app-save-user-filters',
  templateUrl: './save-user-filters.component.html',
  styleUrls: ['./save-user-filters.component.scss']
})
export class SaveUserFiltersComponent implements OnInit {

  private currentSearch: Search;

  public userFilters = [];
  constructor(private store$: Store<AppState>){}

  ngOnInit(): void {
    this.store$.select(userStore.getSearchHistory).pipe(
      map(searches => searches[0])).subscribe(latest_search => this.currentSearch = latest_search)

    this.store$.select(userStore.getSavedFilters).pipe(
     map(searches =>
      searches.map(search => ({filters: search.filters, newSearch: search.searchType}))
      ),
      tap(val => val['newSearch']),
    ).subscribe ( userFilters => this.userFilters = userFilters)
  }

  public onSaveFilters() {
    this.store$.dispatch(new userStore.AddNewFiltersPreset(this.currentSearch));
    // this.userFilters.push((this.userFilters.length - 1).toString());
  }
}
