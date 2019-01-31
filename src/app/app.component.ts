import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';

import { Store, Action } from '@ngrx/store';

import { combineLatest, Subscription, Subject, of } from 'rxjs';
import {
  filter, map, switchMap, withLatestFrom,
  startWith, tap, catchError
} from 'rxjs/operators';

import { AppState } from './store';
import * as granulesStore from '@store/granules';
import * as mapStore from '@store/map';
import * as uiStore from '@store/ui';
import * as filterStore from '@store/filters';

import * as services from '@services';
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
  public interactionMode$ = this.store$.select(mapStore.getMapInteractionMode);
  public interactionTypes = models.MapInteractionModeType;

  private doSearch = new Subject<void>();

  constructor(
    private store$: Store<AppState>,
    private snackBar: MatSnackBar,
    private mapService: services.MapService,
    private asfApiService: services.AsfApiService,
    private urlStateService: services.UrlStateService,
    private wktService: services.WktService,
  ) {}

  public ngOnInit(): void {
    this.validateSearchPolygons();
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
      ),
      this.store$.select(filterStore.getDateRange).pipe(
        map(range => {
          return [range.start, range.end]
            .filter(date => !!date)
            .map(date => date.toISOString());
        })
      ),
      this.store$.select(filterStore.getPathRange).pipe(
        map(range => Object.values(range)
          .filter(v => !!v)
        ),
        map(range => Array.from(new Set(range))),
        map(range => range.length === 2 ?
          range.join('-') :
          range.pop() || null
        )
      ),
      this.store$.select(filterStore.getFrameRange).pipe(
        map(range => Object.values(range)
          .filter(v => !!v)
        ),
        map(range => Array.from(new Set(range))),
        map(range => range.length === 2 ?
          range.join('-') :
          range.pop() || null
        )
      )
    );


    this.doSearch.pipe(
      withLatestFrom(searchState$),
      map(([_, searchState]) => searchState),
      map(
        ([polygon, platforms, [start, end], pathRange, frame]) => {
          const params = {
            intersectsWith: polygon,
            platform: platforms,
            start,
            end,
            relativeOrbit: pathRange,
            frame,
          };

          return Object.entries(params)
            .filter(([param, val]) => !!val)
            .reduce(
              (queryParams, [param, val]) => queryParams.append(param, val),
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

  public onNewMapInteractionMode(mode: models.MapInteractionModeType): void {
    this.store$.dispatch(new mapStore.SetMapInteractionMode(mode));
  }

  public onFileUploadDialogClosed(): void {
    this.onNewMapInteractionMode(models.MapInteractionModeType.EDIT);
  }

  private validateSearchPolygons(): void {
    this.mapService.searchPolygon$.pipe(
      filter(p => !!p),
      switchMap(polygon => this.asfApiService.validate(polygon)),
      map(resp => {
        if (resp.error) {
          const { report, type } = resp.error;

          this.mapService.setPolygonError();
          this.snackBar.open(
            report, 'INVALID POLYGON',
            { duration: 4000, }
          );

          return;
        }

        this.mapService.setValidPolygon();

        const repairs = resp.repairs
          .filter(repair =>
            repair.type !== models.PolygonRepairTypes.ROUND
          );

        if (repairs.length === 0) {
          return resp.wkt;
        }

        const features = this.wktService.wktToFeature(
          resp.wkt,
          this.mapService.epsg()
        );

        this.mapService.setDrawFeature(features);
      }),
      catchError((val, source) => source)
    ).subscribe(_ => _);
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
        browse: g.browse || 'assets/error.png',
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

