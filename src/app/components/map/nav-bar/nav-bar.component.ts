import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import {
  trigger, state, style,
  animate, transition
} from '@angular/animations';

import { interval, Subject, Subscription } from 'rxjs';
import { map, takeUntil, tap, delay, take } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { ClipboardService } from 'ngx-clipboard';

import { AppState } from '@store';
import * as queueStore from '@store/queue';
import * as filtersStore from '@store/filters';
import * as mapStore from '@store/map';
import * as searchStore from '@store/search';

import * as models from '@models';

import { DatapoolAuthService, DateExtremaService, MapService } from '@services';
import { environment } from '@environments/environment';

enum BreadcrumbFilterType {
  DATASET = 'Dataset',
  DATE = 'Date',
  AOI = 'Area of Interest',
  PATH_FRAME = 'Path/Frame',
  ADDITIONAL = 'Additional Filters',
  NONE = 'None'
}

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  animations: [
    trigger('changeMenuX', [
      state('full-width', style({
        width: 'calc(100vw - 450px)'
      })),
      state('half-width',   style({
        width: '100vw'
      })),
      transition('shown <=> hidden', animate('200ms ease-out'))
    ])
  ],
})
export class NavBarComponent {
  public asfWebsiteUrl = 'https://www.asf.alaska.edu';

  @Output() openQueue = new EventEmitter<void>();
  @Output() doSearch = new EventEmitter<void>();

  @Input() products: models.Sentinel1Product[];
  @Input() isSideMenuOpen: boolean;
  @Input() showFilters: boolean;

  constructor(
    private store$: Store<AppState>,
    public datapoolAuthService: DatapoolAuthService,
    private dateExtremaService: DateExtremaService,
    private mapService: MapService,
    public clipboard: ClipboardService,
  ) {}

  public filterTypes = BreadcrumbFilterType;
  public selectedFilter = BreadcrumbFilterType.NONE;

  public loading$ = this.store$.select(searchStore.getIsLoading);

  // Platform Selector
  public platforms$ = this.store$.select(filtersStore.getPlatformsList);
  public selectedPlatformName$ = this.store$.select(filtersStore.getSelectedPlatformNames).pipe(
    map(platform => platform.size === 1 ?
      platform.values().next().value : null
    )
  );

  // Date Selector
  public startDate$ = this.store$.select(filtersStore.getStartDate);
  public endDate$ = this.store$.select(filtersStore.getEndDate);
  public seasonStart$ = this.store$.select(filtersStore.getSeasonStart);
  public seasonEnd$ = this.store$.select(filtersStore.getSeasonEnd);
  public selectedPlatforms$ = this.store$.select(filtersStore.getSelectedPlatforms);

  public dateRangeExtrema$ = this.dateExtremaService.getExtrema$(
    this.platforms$,
    this.selectedPlatforms$,
    this.startDate$,
    this.endDate$,
  );

  // AOI Selector
  public drawMode$ = this.store$.select(mapStore.getMapDrawMode);
  public interactionMode$ = this.store$.select(mapStore.getMapInteractionMode);

  public polygon$ = this.mapService.searchPolygon$;

  // Path/Frame Selector
  public pathRange$ = this.store$.select(filtersStore.getPathRange);
  public frameRange$ = this.store$.select(filtersStore.getFrameRange);
  public shouldOmitSearchPolygon$ = this.store$.select(filtersStore.getShouldOmitSearchPolygon);

  // Additional Filters Selector
  public flightDirections$ = this.store$.select(filtersStore.getFlightDirections);
  public beamModes$ = this.store$.select(filtersStore.getBeamModes);
  public polarizations$ = this.store$.select(filtersStore.getPolarizations);
  public platformProductTypes$ = this.store$.select(filtersStore.getProductTypes);

  public onNewSelectedFilter(filterType: BreadcrumbFilterType): void {
    this.selectedFilter = this.selectedFilter === filterType ?
      BreadcrumbFilterType.NONE : filterType;
  }

  public onDoSearch(): void {
    this.doSearch.emit();
  }

  // Platform Selector
  public onPlatformRemoved(platformName: string): void {
    this.store$.dispatch(new filtersStore.RemoveSelectedPlatform(platformName));
  }

  public onPlatformAdded(platformName: string): void {
    this.store$.dispatch(new filtersStore.AddSelectedPlatform(platformName));
  }

  // Date Selector
  public onNewStartDate(start: Date): void {
    this.store$.dispatch(new filtersStore.SetStartDate(start));
  }

  public onNewEndDate(end: Date): void {
    this.store$.dispatch(new filtersStore.SetEndDate(end));
  }

  public onNewSeasonStart(start: number | null): void {
    this.store$.dispatch(new filtersStore.SetSeasonStart(start));
  }

  public onNewSeasonEnd(end: number | null): void {
    this.store$.dispatch(new filtersStore.SetSeasonEnd(end));
  }

  // AOI Selector
  public onNewDrawModeType(mode: models.MapDrawModeType): void {
    this.store$.dispatch(new mapStore.SetMapDrawMode(mode));
  }

  public onNewInteractionMode(mode: models.MapInteractionModeType): void {
    this.store$.dispatch(new mapStore.SetMapInteractionMode(mode));
  }

  public onOpenFileDialog(): void {
    const action = new mapStore.SetMapInteractionMode(models.MapInteractionModeType.UPLOAD);
    this.store$.dispatch(action);
  }

  // Path/Frame Selector
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

  public onNewOmitGeoRegion(shouldOmitGeoRegion: boolean): void {
    const action = shouldOmitGeoRegion ?
      new filtersStore.OmitSearchPolygon() :
      new filtersStore.UseSearchPolygon();

    this.store$.dispatch(action);
  }

  // Additional Filters
  public onNewFlightDirections(directions: models.FlightDirection[]): void {
    this.store$.dispatch(new filtersStore.SetFlightDirections(directions));
  }

  public onNewBeamModes(platformBeamModes: models.PlatformBeamModes): void {
    this.store$.dispatch(new filtersStore.SetPlatformBeamModes(platformBeamModes));
  }

  public onNewPolarizations(platformPolarizations: models.PlatformPolarizations): void {
    this.store$.dispatch(new filtersStore.SetPlatformPolarizations(platformPolarizations));
  }

  public onNewMaxResults(maxResults): void {
    this.store$.dispatch(new filtersStore.SetMaxResults(maxResults));
  }

  public onNewProductTypes(productTypes: models.PlatformProductTypes): void {
    this.store$.dispatch(new filtersStore.SetPlatformProductTypes(productTypes));
  }


  public onOpenDownloadQueue(): void {
    this.openQueue.emit();
  }

  public onAccountButtonClicked() {
    if (!this.datapoolAuthService.isLoggedIn) {
      this.datapoolAuthService.login();
    } else {
      this.datapoolAuthService.profileInfo()
        .subscribe(console.log);
      console.log('user is logged in...');
    }
  }

  public onCopy(): void {
    this.clipboard.copyFromContent(window.location.href);
  }

  public onShareWithEmail() {
    const subject = `New Search - ${encodeURIComponent(document.title)}`;

    window.open(
      `mailto:?subject=${subject}` +
      `&body=${encodeURIComponent(document.URL)}`
    );
  }
}
