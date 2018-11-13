import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Store } from '@ngrx/store';

import {
  FiltersState,
  getPlatformsList, getSelectedPlatforms,
  AddSelectedPlatform, RemoveSelectedPlatform
} from './../store/filters';

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
  public selectedPlatforms$ = this.store$.select(getSelectedPlatforms);

  constructor(private store$: Store<FiltersState>) {
    this.selectedPlatforms$.subscribe(
      v => console.log(v)
    );
  }

  public onPlatformRemoved(platformName: string): void {
    this.store$.dispatch(new RemoveSelectedPlatform(platformName));
  }

  public onPlatformAdded(platformName: string): void {
    this.store$.dispatch(new AddSelectedPlatform(platformName));
  }
}
