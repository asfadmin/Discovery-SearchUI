import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {
    trigger,
    state,
    style,
    animate,
    transition
} from '@angular/animations';

import { Store } from '@ngrx/store';

import {
  FiltersState,
  getPlatformsList, getSelectedPlatforms,
  getSelectedFilter, getSelectedPlatformNames,
  AddSelectedPlatform, RemoveSelectedPlatform, SetSelectedFilter
} from './../store/filters';
import { getError } from './../store/granules';
import { FilterType } from '../models';

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

  public isHidden = false;

  public platforms$ = this.store$.select(getPlatformsList);
  public selectedPlatformNames$ = this.store$.select(getSelectedPlatformNames);
  public selectedPlatforms$ = this.store$.select(getSelectedPlatforms);
  public error$ = this.store$.select(getError);

  public selectedFilter$ = this.store$.select(getSelectedFilter);

  public filterType = FilterType;

  constructor(private store$: Store<FiltersState>) {}

  public onPlatformRemoved(platformName: string): void {
    this.store$.dispatch(new RemoveSelectedPlatform(platformName));
  }

  public onPlatformAdded(platformName: string): void {
    this.store$.dispatch(new AddSelectedPlatform(platformName));
  }

  public onNewFilterSelected(filter: FilterType): void {
    this.store$.dispatch(new SetSelectedFilter(filter));
  }

  public onToggleHide(): void {
    this.isHidden = !this.isHidden;
  }
}
