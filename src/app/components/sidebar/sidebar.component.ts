import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {
  trigger, state, style,
  animate, transition
} from '@angular/animations';

import { combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as filtersStore from '@store/filters';
import * as uiStore from '@store/ui';
import * as granulesStore from '@store/granules';

import { FilterType } from '@models';

const oldest = (d1, d2) => d1 < d2 ? d1 : d2;
const youngest = (d1, d2) => d1 > d2 ? d1 : d2;

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

  public startDate$ = this.store$.select(filtersStore.getStartDate);
  public endDate$ = this.store$.select(filtersStore.getEndDate);

  public isSidebarOpen$ = this.store$.select(uiStore.getIsSidebarOpen);
  public selectedFilter$ = this.store$.select(uiStore.getSelectedFilter);

  public error$ = this.store$.select(granulesStore.getError);
  public granules$ = this.store$.select(granulesStore.getGranules);
  public loading$  = this.store$.select(granulesStore.getLoading);

  public filterType = FilterType;

  public startMin$ = combineLatest(
    this.platforms$,
    this.selectedPlatforms$
  ).pipe(
    map(([platforms, selected]) => {
      const dates = selected.length > 0 ?
        selected :
        platforms;

      return dates
        .map(platform => platform.date.start)
        .reduce(oldest);
    })
  );

  public startMax$ = combineLatest(
    this.platforms$,
    this.selectedPlatforms$,
    this.endDate$
  ).pipe(
    map(([platforms, selected, userEnd]) => {
      if (!!userEnd) {
        return userEnd;
      }

      const dates = selected.length > 0 ?
        selected :
        platforms;

      const max = dates
        .map(platform => platform.date.end || new Date(Date.now()))
        .reduce(youngest);

      return max;
    })
  );

  public endMin$ = combineLatest(
    this.platforms$,
    this.selectedPlatforms$,
    this.startDate$
  ).pipe(
    map(([platforms, selected, userStart]) => {
      if (!!userStart) {
        return userStart;
      }

      const dates = selected.length > 0 ?
        selected :
        platforms;

      const min = dates
        .map(platform => platform.date.start)
        .reduce(oldest);

      return min;
    })
  );

  public endMax$ = combineLatest(
    this.platforms$,
    this.selectedPlatforms$
  ).pipe(
    map(([platforms, selected]) => {
      const dates = selected.length > 0 ?
        selected :
        platforms;

      const max = dates
        .map(platform => platform.date.end || new Date(Date.now()))
        .reduce(youngest);

      return max;
    })
  );


  constructor(private store$: Store<AppState>) {}

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

  public onNewStartDate(start: Date): void {
    this.store$.dispatch(new filtersStore.SetStartDate(start));
  }

  public onNewEndDate(end: Date): void {
    this.store$.dispatch(new filtersStore.SetEndDate(end));
  }
}

