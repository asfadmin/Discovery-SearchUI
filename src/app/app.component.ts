import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { Store, Action } from '@ngrx/store';

import { combineLatest, Subscription, Subject } from 'rxjs';
import { filter, map, switchMap, skip, withLatestFrom, startWith } from 'rxjs/operators';

import { AppState } from './store';
import * as granulesStore from '@store/granules';
import * as mapStore from '@store/map';
import * as uiStore from '@store/ui';
import * as filterStore from '@store/filters';

import { AsfApiService, UrlStateService, MapService } from './services';
import * as models from './models';

@Component({
  selector   : 'app-root',
  templateUrl: './app.component.html',
  styleUrls  : ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public granules$ = this.store$.select(granulesStore.getGranules);

  public view$ = this.store$.select(mapStore.getMapView);
  public drawMode$ = this.store$.select(mapStore.getMapDrawMode);

  private doSearch = new Subject<void>();

  constructor(
    private store$: Store<AppState>,
    private mapService: MapService,
    private asfApiService: AsfApiService,
    private urlStateService: UrlStateService,
  ) {}

  public ngOnInit(): void {
    const searchState$ = combineLatest(
        this.mapService.searchPolygon$.pipe(
          startWith(null)
        ),
      this.store$.select(filterStore.getSelectedPlatforms).pipe(
        map(platforms => platforms
          .map(platform => platform.name)
          .join(',')
          .replace('ALOS PALSAR', 'ALOS')
        )
      )
    );

    this.doSearch.pipe(
      withLatestFrom(searchState$),
      map(([_, searchState]) => searchState),
      map(
        ([polygon, platforms]) => {
          const params = {
            intersectsWith: polygon,
            platform: platforms
          };

          return Object.entries(params)
            .filter(([key, val]) => !!val)
            .reduce(
              (queryParams, [key, val]) => queryParams.append(key, val),
              new HttpParams()
            );
        }),
      switchMap(
        params => this.asfApiService.query(params).pipe(
          map(setGranules)
        )
      )
    ).subscribe(action => this.store$.dispatch(action));
  }

  public onLoadUrlState(): void {
    this.urlStateService.load();
  }

  public onNewSearch(): void {
    this.doSearch.next();
  }

  public onClearSearch(): void {
    this.store$.dispatch(new granulesStore.ClearGranules());
    this.mapService.clearDrawLayer();
  }

  public onNewMapView(view: models.MapViewType): void {
    this.store$.dispatch(new mapStore.SetMapView(view));
  }

  public onNewMapDrawMode(mode: models.MapDrawModeType): void {
    this.store$.dispatch(new mapStore.SetMapDrawMode(mode));
  }
}


const setGranules =
  (resp: any) => new granulesStore.SetGranules(
    resp[0].map(
      (g: any): models.Sentinel1Product => ({
        name: g.granuleName,
        downloadUrl: g.downloadUrl,
        bytes: +g.sizeMB * 1000000,
        platform: g.platform,
        browse: g.browse || 'https://datapool.asf.alaska.edu/BROWSE/SB/S1B_EW_GRDM_1SDH_20170108T192334_20170108T192434_003761_00676D_4E7B.jpg',
        metadata: getMetadataFrom(g)
      })
    )
  );

const getMetadataFrom = (g: any): models.Sentinel1Metadata => {
  return {
    date:  fromCMRDate(g.processingDate),
    polygon: g.stringFootprint,

    productType: <models.Sentinel1ProductType>g.processingLevel,
    beamMode: <models.Sentinel1BeamMode>g.beamMode,
    polarization: <models.Sentinel1Polarization>g.polarization,
    flightDirection: <models.FlightDirection>g.flightDirection,
    frequency: g.frequency,

    path: +g.relativeOrbit,
    frame:  +g.frameNumber,
    absoluteOrbit: +g.absoluteOrbit
  };
};

const fromCMRDate = (dateString: string): Date => {
  return new Date(dateString);
};

