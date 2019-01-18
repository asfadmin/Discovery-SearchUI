import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {
  trigger, state, style,
  animate, transition
} from '@angular/animations';

import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as fromFilters from '@store/filters';
import * as fromUI from '@store/ui';
import * as fromGranules from '@store/granules';

import { FilterType } from '@models';

@Component({
  selector: 'app-filters-menu',
  templateUrl: './filters-menu.component.html',
  styleUrls: ['./filters-menu.component.css'],
  animations: [
    trigger('changeMenuState', [
      state('shown', style({
        transform: 'translateX(100%) translateX(-25px)'
      })),
      state('hidden',   style({
        transform: 'translateX(0%)'
      })),
      transition('shown <=> hidden', animate('200ms ease-out'))
    ])
  ],
})
export class FiltersMenuComponent {
  @Input() isLoading: boolean;

  @Output() newSearch = new EventEmitter<string>();
  @Output() clearSearches = new EventEmitter<void>();

  public platforms$ = this.store$.select(fromFilters.getPlatformsList);
  public selectedPlatformNames$ = this.store$.select(fromFilters.getSelectedPlatformNames);
  public selectedPlatforms$ = this.store$.select(fromFilters.getSelectedPlatforms);
  public error$ = this.store$.select(fromGranules.getError);
  public isFiltersMenuOpen$ = this.store$.select(fromUI.getIsFiltersMenuOpen);
  public selectedFilter$ = this.store$.select(fromUI.getSelectedFilter);
  public granules$ = this.store$.select(fromGranules.getGranules);

  public filterType = FilterType;

  constructor(private store$: Store<AppState>) {}

  public onPlatformRemoved(platformName: string): void {
    this.store$.dispatch(new fromFilters.RemoveSelectedPlatform(platformName));
  }

  public onPlatformAdded(platformName: string): void {
    this.store$.dispatch(new fromFilters.AddSelectedPlatform(platformName));
  }

  public onNewFilterSelected(filter: FilterType): void {
    this.store$.dispatch(new fromUI.SetSelectedFilter(filter));
  }

  public onToggleHide(): void {
    this.store$.dispatch(new fromUI.ToggleFiltersMenu());
  }
}
