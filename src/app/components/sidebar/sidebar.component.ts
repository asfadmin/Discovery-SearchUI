import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import {
  trigger, state, style,
  animate, transition
} from '@angular/animations';

import { Observable } from 'rxjs';
import { map, tap, filter } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { DateExtremaService } from '@services';
import { AppState } from '@store';
import * as filtersStore from '@store/filters';
import * as uiStore from '@store/ui';
import * as granulesStore from '@store/granules';
import * as searchStore from '@store/search';
import * as queueStore from '@store/queue';

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
export class SidebarComponent {
  @Input() isLoading: boolean;

  @Output() newSearch = new EventEmitter<void>();
  @Output() clearSearch = new EventEmitter<void>();
  @Output() openSpreadsheet = new EventEmitter<void>();

  public searchType = models.SearchType;

  public platforms$ = this.store$.select(filtersStore.getPlatformsList);
  public platformProductTypes$ = this.store$.select(filtersStore.getProductTypes);
  public selectedPlatformNames$ = this.store$.select(filtersStore.getSelectedPlatformNames);
  public selectedPlatforms$ = this.store$.select(filtersStore.getSelectedPlatforms);

  public startDate$ = this.store$.select(filtersStore.getStartDate);
  public endDate$ = this.store$.select(filtersStore.getEndDate);
  public pathRange$ = this.store$.select(filtersStore.getPathRange);
  public frameRange$ = this.store$.select(filtersStore.getFrameRange);
  public shouldOmitSearchPolygon$ = this.store$.select(filtersStore.getShouldOmitSearchPolygon);
  public listSearchMode$ = this.store$.select(filtersStore.getListSearchMode);
  public flightDirections$ = this.store$.select(filtersStore.getFlightDirections);
  public beamModes$ = this.store$.select(filtersStore.getBeamModes);
  public polarizations$ = this.store$.select(filtersStore.getPolarizations);
  public maxResults$ = this.store$.select(filtersStore.getMaxSearchResults).pipe(
    map(maxResults => maxResults.toString())
  );

  public isSidebarOpen$ = this.store$.select(uiStore.getIsSidebarOpen);
  public selectedFilter$ = this.store$.select(uiStore.getSelectedFilter);

  public granules$ = this.store$.select(granulesStore.getGranules).pipe(
    tap(granules => {
      if (granules.length > 0) {
        this.selectedTab = 1;
      }
    })
  );

  public selectedGranule$ = this.store$.select(granulesStore.getSelectedGranule);
  public selectedProducts$ = this.store$.select(granulesStore.getSelectedGranuleProducts);
  public searchList$ = this.store$.select(granulesStore.getSearchList).pipe(
    map(list => list.join('\n'))
  );

  public loading$ = this.store$.select(searchStore.getIsLoading);
  public searchError$ = this.store$.select(searchStore.getSearchError);

  public queueProducts$ = this.store$.select(queueStore.getQueuedProducts);

  public dateRangeExtrema$ = this.dateExtremaService.getExtrema$(
    this.platforms$,
    this.selectedPlatforms$,
    this.startDate$,
    this.endDate$,
  );

  public filterType = models.FilterType;
  public selectedTab = 0;
  public selectedSearchType: null | models.SearchType = null;

  constructor(
    private dateExtremaService: DateExtremaService,
    private router: Router,
    private store$: Store<AppState>,
  ) {}

  public onTabChange(tabIndex: number): void {
    this.selectedTab = tabIndex;
  }

  public onSetSearchType(searchType: models.SearchType): void {

    this.selectedSearchType =
      searchType === this.selectedSearchType ?  null : searchType;
  }

  public onAppReset() {
    this.router.navigate(['/'], { queryParams: {} }) ;
    window.location.reload();
  }

  public onOpenSpreadsheet(): void {
    this.openSpreadsheet.emit();
  }

  public onPlatformRemoved(platformName: string): void {
    this.store$.dispatch(new filtersStore.RemoveSelectedPlatform(platformName));
  }

  public onPlatformAdded(platformName: string): void {
    this.store$.dispatch(new filtersStore.AddSelectedPlatform(platformName));
  }

  public onNewFilterSelected(selectedFilter: models.FilterType): void {
    this.store$.dispatch(new uiStore.SetSelectedFilter(selectedFilter));
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

  public onNewGranuleSelected(name: string): void {
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

  public onNewGranuleList(searchList: string[]): void {
    this.store$.dispatch(new granulesStore.SetSearchList(searchList));
  }

  public onNewOmitGeoRegion(shouldOmitGeoRegion: boolean): void {
    const action = shouldOmitGeoRegion ?
      new filtersStore.OmitSearchPolygon() :
      new filtersStore.UseSearchPolygon();

    this.store$.dispatch(action);
  }

  public onNewListSearchMode(mode: models.ListSearchType): void {
    this.store$.dispatch(new filtersStore.SetListSearchType(mode));
  }

  public onNewQueueItem(product: models.Sentinel1Product): void {
    this.store$.dispatch(new queueStore.AddItem(product));
  }

  public onNewQueueItems(products: models.Sentinel1Product[]): void {
    this.store$.dispatch(new queueStore.AddItems(products));
  }

  public onQueueGranuleProducts(name: string): void {
    this.store$.dispatch(new queueStore.QueueGranule(name));
  }

  public onNewProductTypes(productTypes: models.PlatformProductTypes): void {
    this.store$.dispatch(new filtersStore.SetPlatformProductTypes(productTypes));
  }

  public onNewFlightDirections(directions: models.FlightDirection[]): void {
    this.store$.dispatch(new filtersStore.SetFlightDirections(directions));
  }

  public onNewBeamModes(platformBeamModes: models.PlatformBeamModes): void {
    this.store$.dispatch(new filtersStore.SetPlatformBeamModes(platformBeamModes));
  }

  public onNewPolarizations(platformPolarizations: models.PlatformPolarizations): void {
    this.store$.dispatch(new filtersStore.SetPlatformPolarizations(platformPolarizations));
  }

  public onNewFocusedGranule(granule: models.Sentinel1Product): void {
    this.store$.dispatch(new granulesStore.SetFocusedGranule(granule));
  }

  public onClearFocusedGranule(): void {
    this.store$.dispatch(new granulesStore.ClearFocusedGranule());
  }

  public onNewMaxResults(maxResults): void {
    this.store$.dispatch(new filtersStore.SetMaxResults(maxResults));
  }
}

