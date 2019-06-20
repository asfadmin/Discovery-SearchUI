import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as uiStore from '@store/ui';

import * as models from '@models';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  public searchType$ = this.store$.select(uiStore.getSearchType);

  constructor(private store$: Store<AppState>) { }

  ngOnInit() {
  }

  public onSetSearchType(searchType: models.SearchType): void {
    this.store$.dispatch(new uiStore.SetSearchType(searchType));
  }
}
