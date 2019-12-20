import { Component } from '@angular/core';

import {
  trigger, state, style, animate, transition
} from '@angular/animations';

import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as uiStore from '@store/ui';
import * as searchStore from '@store/search';

import * as models from '@models';

@Component({
  selector: 'app-search-dropdown',
  templateUrl: './search-dropdown.component.html',
  styleUrls: ['./search-dropdown.component.scss'],
  animations: [
    trigger('isOpen', [
      state('true', style({transform: 'translateY(0%)'})),
      state('false', style({transform: 'translateY(-10000%)'})
      ),
      transition('true => false', animate('50ms ease-out')),
      transition('false => true', animate('50ms ease-in'))
    ])
  ],
})
export class SearchDropdownComponent {
  public isFiltersMenuOpen$ = this.store$.select(uiStore.getIsFiltersMenuOpen);

  public filterType = models.FilterType;
  public searchType$ = this.store$.select(searchStore.getSearchType);
  public searchTypes = models.SearchType;

  constructor(private store$: Store<AppState>) {}

  public closePanel(): void {
    this.store$.dispatch(new uiStore.CloseFiltersMenu());
  }

  public onSetSearchType(searchType: models.SearchType): void {
    this.store$.dispatch(new searchStore.SetSearchType(searchType));
  }
}

