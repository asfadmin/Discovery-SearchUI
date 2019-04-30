import { Component, OnInit } from '@angular/core';

import { combineLatest } from 'rxjs';
import { map, tap, filter } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { DateExtremaService, MapService } from '@services';
import { AppState } from '@store';
import * as filtersStore from '@store/filters';
import * as mapStore from '@store/map';

import * as models from '@models';

@Component({
  selector: 'app-dataset-search',
  templateUrl: './dataset-search.component.html',
  styleUrls: ['./dataset-search.component.css']
})
export class DatasetSearchComponent implements OnInit {

  public platforms$ = this.store$.select(filtersStore.getPlatformsList);
  public platformProductTypes$ = this.store$.select(filtersStore.getProductTypes);
  public selectedPlatformName$ = this.store$.select(filtersStore.getSelectedPlatformNames).pipe(
    map(platform => platform.size === 1 ?
      platform.values().next().value : null
    )
  );
  public selectedPlatforms$ = this.store$.select(filtersStore.getSelectedPlatforms);

  public startDate$ = this.store$.select(filtersStore.getStartDate);
  public endDate$ = this.store$.select(filtersStore.getEndDate);
  public seasonStart$ = this.store$.select(filtersStore.getSeasonStart);
  public seasonEnd$ = this.store$.select(filtersStore.getSeasonEnd);
  public pathRange$ = this.store$.select(filtersStore.getPathRange);
  public frameRange$ = this.store$.select(filtersStore.getFrameRange);
  public shouldOmitSearchPolygon$ = this.store$.select(filtersStore.getShouldOmitSearchPolygon);

  public flightDirections$ = this.store$.select(filtersStore.getFlightDirections);
  public beamModes$ = this.store$.select(filtersStore.getBeamModes);
  public polarizations$ = this.store$.select(filtersStore.getPolarizations);
  public maxResults$ = this.store$.select(filtersStore.getMaxSearchResults).pipe(
    map(maxResults => maxResults.toString())
  );

  public drawMode$ = this.store$.select(mapStore.getMapDrawMode);
  public interactionMode$ = this.store$.select(mapStore.getMapInteractionMode);

  public polygon$ = this.mapService.searchPolygon$;

  public dateRangeExtrema$ = this.dateExtremaService.getExtrema$(
    this.platforms$,
    this.selectedPlatforms$,
    this.startDate$,
    this.endDate$,
  );

  constructor(
    private mapService: MapService,
    private store$: Store<AppState>,
    private dateExtremaService: DateExtremaService,
  ) { }

  public ngOnInit(): void {
  }

  public onNewDrawModeType(mode: models.MapDrawModeType): void {
    this.store$.dispatch(new mapStore.SetMapDrawMode(mode));
  }

  public onNewInteractionMode(mode: models.MapInteractionModeType): void {
    this.store$.dispatch(new mapStore.SetMapInteractionMode(mode));
  }

  public onPlatformRemoved(platformName: string): void {
    this.store$.dispatch(new filtersStore.RemoveSelectedPlatform(platformName));
  }

  public onPlatformAdded(platformName: string): void {
    this.store$.dispatch(new filtersStore.AddSelectedPlatform(platformName));
  }

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

  public onOpenFileDialog(): void {
    const action = new mapStore.SetMapInteractionMode(models.MapInteractionModeType.UPLOAD);
    this.store$.dispatch(action);
  }
}
