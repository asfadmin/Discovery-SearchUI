import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import {
  trigger, state, style, animate, transition
} from '@angular/animations';

import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as uiStore from '@store/ui';
import * as searchStore from '@store/search';

import * as models from '@models';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('changeMenuState', [
      state('shown', style({ transform: 'translateX(100%)'
      })),
      state('hidden',   style({
        transform: 'translateX(0%)'
      })),
      transition('shown <=> hidden', animate('200ms ease-out'))
    ])
  ],
})
export class SidebarComponent implements OnInit {
  @Output() newSearch = new EventEmitter<void>();
  @Output() clearSearch = new EventEmitter<void>();

  public isSidebarOpen$ = this.store$.select(uiStore.getIsSidebarOpen);
  public isFiltersMenuOpen$ = this.store$.select(uiStore.getIsFiltersMenuOpen);

  public searchError$ = this.store$.select(searchStore.getSearchError);

  public filterType = models.FilterType;
  public selectedSearchType: models.SearchType;

  constructor(private store$: Store<AppState>) {}

  ngOnInit(): void {
    this.store$.select(uiStore.getSearchType).subscribe(
      searchType => this.selectedSearchType = searchType
    );
  }

  public closePanel(): void {
    this.store$.dispatch(new uiStore.CloseFiltersMenu());
  }

  public onSetSearchType(searchType: models.SearchType): void {
    this.store$.dispatch(new uiStore.SetSearchType(searchType));
  }
}

