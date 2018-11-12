import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Store } from '@ngrx/store';

import { FiltersState, getPlatformsList } from './../store/filters';

@Component({
  selector: 'app-filters-menu',
  templateUrl: './filters-menu.component.html',
  styleUrls: ['./filters-menu.component.css']
})
export class FiltersMenuComponent {
  @Input() isLoading: boolean;

  @Output() newSearch = new EventEmitter<string>();
  @Output() clearSearches = new EventEmitter<void>();

  public platforms$ = this.store$.select(getPlatformsList);

  constructor(private store$: Store<FiltersState>) {
    this.platforms$.subscribe(
      v => console.log(v)
    );
  }
}
