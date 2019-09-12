import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as filtersStore from '@store/filters';

import * as models from '@models';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  @Input() selectedSearchType: models.SearchType;
  @Output() newSearchType = new EventEmitter<models.SearchType>();

  public searchTypes = models.SearchType;

  public dataset$ = this.store$.select(filtersStore.getSelectedDataset);

  constructor(private store$: Store<AppState>) {}

  public onSetSearchType(searchType: models.SearchType): void {
    this.newSearchType.emit(searchType);
  }

}


