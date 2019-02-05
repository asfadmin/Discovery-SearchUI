import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {
  trigger, state, style,
  animate, transition
} from '@angular/animations';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { DateExtremaService } from '@services';
import { AppState } from '@store';
import * as filtersStore from '@store/filters';
import * as uiStore from '@store/ui';
import * as granulesStore from '@store/granules';

import { FilterType } from '@models';


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
  public pathRange$ = this.store$.select(filtersStore.getPathRange);
  public frameRange$ = this.store$.select(filtersStore.getFrameRange);
  public shouldOmitSearchPolygon$ = this.store$.select(filtersStore.getShouldOmitSearchPolygon);

  public isSidebarOpen$ = this.store$.select(uiStore.getIsSidebarOpen);
  public selectedFilter$ = this.store$.select(uiStore.getSelectedFilter);

  public error$ = this.store$.select(granulesStore.getError);
  public granules$ = this.store$.select(granulesStore.getGranules);
  public selectedGranule$ = this.store$.select(granulesStore.getSelectedGranule);
  public loading$  = this.store$.select(granulesStore.getLoading);
  public selectedProducts$ = this.store$.select(granulesStore.getSelectedGranuleProducts);

  public dateRangeExtrema$ = this.dateExtremaService.getExtrema$(
    this.platforms$,
    this.selectedPlatforms$,
    this.startDate$,
    this.endDate$,
  );

  public filterType = FilterType;

  constructor(
    private dateExtremaService: DateExtremaService,
    private store$: Store<AppState>,
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

  public onNewStartDate(start: Date): void {
    this.store$.dispatch(new filtersStore.SetStartDate(start));
  }

  public onNewEndDate(end: Date): void {
    this.store$.dispatch(new filtersStore.SetEndDate(end));
  }

  public onNewProductSelected(name: string): void {
    this.store$.dispatch(new granulesStore.SetSelectedGranule(name));
  }

  public onNewPathStart(path: number): void {
    this.store$.dispatch(new filtersStore.SetPathStart(path));
  }

  public onNewPathEnd(path: number): void {
    this.store$.dispatch(new filtersStore.SetPathEnd(path));
  }

  public onNewFrameStart(frame: number): void {
    this.store$.dispatch(new filtersStore.SetFrameStart(frame));
  }

  public onNewFrameEnd(frame: number): void {
    this.store$.dispatch(new filtersStore.SetFrameEnd(frame));
  }

  public onNewGranuleList(granuleList: string[]): void {
    this.store$.dispatch(new granulesStore.SetGranuleSearchList(granuleList));
  }

  public onNewOmitGeoRegion(shouldOmitGeoRegion: boolean): void {
    const action = shouldOmitGeoRegion ?
      new filtersStore.OmitSearchPolygon() :
      new filtersStore.UseSearchPolygon();

    this.store$.dispatch(action);
  }
}

