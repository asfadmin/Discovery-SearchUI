import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as uiStore from '@store/ui';
import { HistoryService, Search } from '@services';

import * as models from '@models';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  public searchType$ = this.store$.select(uiStore.getSearchType);
  public history$ = this.historyService.searchHistory$;

  constructor(
    private store$: Store<AppState>,
    private historyService: HistoryService
  ) { }

  public onSetSearchType(searchType: models.SearchType): void {
    this.store$.dispatch(new uiStore.SetSearchType(searchType));
  }

  public onSetSearch(search: Search): void {
    console.log(search);
  }
}
