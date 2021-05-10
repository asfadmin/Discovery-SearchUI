import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as filtersStore from '@store/filters';

@Component({
  selector: 'app-cancel-filter-changes',
  templateUrl: './cancel-filter-changes.component.html',
  styleUrls: ['./cancel-filter-changes.component.scss']
})
export class CancelFilterChangesComponent implements OnInit {

  constructor(private store$: Store<AppState>, ) { }

  ngOnInit(): void {
  }

  public onCancelFiltersChange(): void {
    this.store$.dispatch(new filtersStore.RestoreFilters());
    this.store$.dispatch(new filtersStore.StoreCurrentFilters());
  }

}
