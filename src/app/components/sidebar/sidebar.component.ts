import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {
  trigger, state, style,
  animate, transition
} from '@angular/animations';

import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as filtersStore from '@store/filters';
import * as uiStore from '@store/ui';
import * as granulesStore from '@store/granules';

import { FilterType } from '@models';
import { RoutedSearchService } from '@services';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
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
export class SidebarComponent {
  @Input() isLoading: boolean;

  @Output() newSearch = new EventEmitter<void>();
  @Output() clearSearch = new EventEmitter<void>();

  public platforms$ = this.store$.select(filtersStore.getPlatformsList);
  public selectedPlatformNames$ = this.store$.select(filtersStore.getSelectedPlatformNames);
  public selectedPlatforms$ = this.store$.select(filtersStore.getSelectedPlatforms);

  public isSidebarOpen$ = this.store$.select(uiStore.getIsSidebarOpen);
  public selectedFilter$ = this.store$.select(uiStore.getSelectedFilter);

  public error$ = this.store$.select(granulesStore.getError);
  public granules$ = this.store$.select(granulesStore.getGranules);
  public loading$  = this.store$.select(granulesStore.getLoading);

  public filterType = FilterType;

  constructor(
    private store$: Store<AppState>,
    private routedSearchService: RoutedSearchService,
  ) {}

  public onPlatformRemoved(platformName: string): void {
    this.store$.dispatch(new filtersStore.RemoveSelectedPlatform(platformName));
  }

  public onPlatformAdded(platformName: string): void {
    this.store$.dispatch(new filtersStore.AddSelectedPlatform(platformName));
  }

  public onNewFilterSelected(filter: FilterType): void {
    this.store$.dispatch(new uiStore.SetSelectedFilter(filter));
  }

  public onToggleHide(): void {
    this.store$.dispatch(new uiStore.ToggleSidebar());
  }

  public onNewSearch(): void {
    this.newSearch.emit();
  }

  public onClearSearch(): void {
    this.clearSearch.emit();
  }
}
