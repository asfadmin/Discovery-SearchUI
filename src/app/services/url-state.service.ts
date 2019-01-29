import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Store, Action } from '@ngrx/store';

import { combineLatest, Subscription } from 'rxjs';
import { filter, map, switchMap, skip, tap } from 'rxjs/operators';

import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';

import { AppState } from '@store';
import * as granulesStore from '@store/granules';
import * as mapStore from '@store/map';
import * as uiStore from '@store/ui';
import * as filterStore from '@store/filters';

import { MapService } from './map/map.service';
import { WktService } from './wkt.service';

import * as models from '@models';


@Injectable({
  providedIn: 'root'
})
export class UrlStateService {
  public urlAppState: Subscription;

  private urlParams: models.UrlParameter[];
  private params = {};
  private isNotLoaded = true;

  constructor(
    private store$: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    private mapService: MapService,
    private wktService: WktService,
    private router: Router,
  ) {
    this.urlParams = [
      ...this.mapParameters(),
      ...this.uiParameters(),
      ...this.filtersParameters(),
    ];
  }

  private uiParameters() {
    return [{
      name: 'isSidebarOpen',
      source: this.store$.select(uiStore.getIsSidebarOpen).pipe(
        skip(1),
        map(isSidebarOpen => ({ isSidebarOpen }))
      ),
      loader: this.loadIsSidebarOpen
    }, {
      name: 'selectedFilter',
      source: this.store$.select(uiStore.getSelectedFilter).pipe(
        skip(1),
        map(selectedFilter => ({ selectedFilter }))
      ),
      loader: this.loadSelectedFilter
    }];
  }

  private filtersParameters() {
    return [{
      name: 'platforms',
      source: this.store$.select(filterStore.getSelectedPlatformNames).pipe(
        skip(1),
        filter(platforms => platforms.size > 0),
        map(selected => ({
          platforms: Array.from(selected).join(','),
        }))
      ),
      loader: this.loadSelectedPlatforms
    }, {
      name: 'start',
      source: this.store$.select(filterStore.getStartDate).pipe(
        skip(1),
        map(start => ({ start }))
      ),
      loader: this.loadStartDate
    }, {
      name: 'end',
      source: this.store$.select(filterStore.getEndDate).pipe(
        skip(1),
        map(end => ({ end }))
      ),
      loader: this.loadEndDate
    }];
  }

  private mapParameters() {
    return [{
      name: 'view',
      source: this.store$.select(mapStore.getMapView).pipe(
        skip(1),
        map(view => ({ view }))
      ),
      loader: this.loadMapView
    }, {
      name: 'drawMode',
      source: this.store$.select(mapStore.getMapDrawMode).pipe(
        skip(1),
        map(drawMode => ({ drawMode })
        )
      ),
      loader: this.loadMapDrawMode
    }, {
      name: 'center',
      source: this.mapService.center$.pipe(
        skip(1),
        map(center => ({ center: `${center.lon},${center.lat}` }))
      ),
      loader: this.loadMapCenter
    }, {
      name: 'zoom',
      source: this.mapService.zoom$.pipe(
        skip(1),
        map(zoom => ({ zoom }))
      ),
      loader: this.loadMapZoom
    }, {
      name: 'polygon',
      source: this.mapService.searchPolygon$.pipe(
        map(polygon => ({ polygon }))
      ),
      loader: this.loadSearchPolygon
    }];
  }

  public load(): void {
    this.activatedRoute.queryParams.pipe(
      skip(1),
      filter(params => this.isNotLoaded),
      tap(() => this.isNotLoaded = false)
    )
    .subscribe(params => {
      this.loadStateFrom(params);
    });

    this.urlParams.forEach(
      param => param.source.subscribe(
        this.updateRouteWithParams
      )
    );
  }

  private updateRouteWithParams = (queryParams: Params): void => {
    this.params = {...this.params, ...queryParams};

    this.router.navigate(['.'], {
      queryParams: this.params,
    });
  }

  private loadStateFrom(params: Params): void {
    this.params = { ...this.params, ...params };

    const urlParamLoaders: { [id: string]: (string) => void } = this.urlParams.reduce(
      (loaders, param) => {
        loaders[param.name] = param.loader;

        return loaders;
      },
      {}
    );

    Object.entries(urlParamLoaders).forEach(
      ([paramName, load]) => params[paramName] && load(params[paramName])
    );
  }

  private loadIsSidebarOpen = (isSidebarOpenStr: string): void => {
    const action = isSidebarOpenStr !== 'false' ?
      new uiStore.OpenSidebar() :
      new uiStore.CloseSidebar();

    this.store$.dispatch(action);
  }

  private loadSelectedFilter = (selected: string): void => {
    if (Object.values(models.FilterType).includes(selected)) {

      const action = new uiStore.SetSelectedFilter(<models.FilterType>selected);
      this.store$.dispatch(action);
    }
  }

  private loadMapDrawMode = (mode: string): void => {
    if (Object.values(models.MapDrawModeType).includes(mode)) {
      const action = new mapStore.SetMapDrawMode(<models.MapDrawModeType>mode);

      this.store$.dispatch(action);
    }
  }

  private loadMapView = (view: string): void => {
    if (Object.values(models.MapViewType).includes(view)) {
      const action = new mapStore.SetMapView(<models.MapViewType>view);

      this.store$.dispatch(action);
    }
  }

  private loadMapZoom = (zoomStr: string): void => {
    const zoom = +zoomStr;

    if (this.isNumber(zoom)) {
      this.mapService.setZoom(zoom);
    }
  }

  private loadMapCenter = (centerStr: string): void => {
    const center = centerStr.split(',').map(v => +v);

    if (center.length === 2 && center.every(this.isNumber)) {
      const [lon, lat] = center;

      this.mapService.setCenter({ lon, lat });
    }
  }

  private loadSelectedPlatforms = (platforms: string): void => {
    const selectedPlatforms = platforms
      .split(',')
      .filter(name => models.platformNames.includes(name));

    const action = new filterStore.SetSelectedPlatforms(selectedPlatforms);

    this.store$.dispatch(action);
  }

  public loadSearchPolygon = (polygon: string): void => {
    const features = this.wktService.wktToFeature(
      polygon,
      this.mapService.epsg()
    );

    this.mapService.setDrawFeature(features);
  }

  private loadStartDate = (start: string): void => {
    const startDate = new Date(start);

    if (!this.isValidDate(startDate)) {
      return;
    }

    this.store$.dispatch(new filterStore.SetStartDate(startDate));
  }

  private loadEndDate = (end: string): void => {
    const endDate = new Date(end);

    if (!this.isValidDate(endDate)) {
      return;
    }

    this.store$.dispatch(new filterStore.SetEndDate(endDate));
  }

  private isNumber = n => !isNaN(n) && isFinite(n);
  private isValidDate = (d: Date): boolean => d instanceof Date && !isNaN(d.valueOf());
}
