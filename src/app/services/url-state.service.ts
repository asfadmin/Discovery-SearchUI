import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Store, Action } from '@ngrx/store';

import { combineLatest, Subscription } from 'rxjs';
import { filter, map, switchMap, skip, tap } from 'rxjs/operators';

import WKT from 'ol/format/WKT.js';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';

import { AppState } from '@store';
import * as granulesStore from '@store/granules';
import * as mapStore from '@store/map';
import * as uiStore from '@store/ui';
import * as filterStore from '@store/filters';

import { MapService } from '@services/map/map.service';
import * as models from '@models';


@Injectable({
  providedIn: 'root'
})
export class UrlStateService {
  public urlAppState: Subscription;

  private params = {};
  private isNotLoaded = true;

  constructor(
    private store$: Store<AppState>,
    private mapService: MapService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  public load(): void {
    this.activatedRoute.queryParams.pipe(
      skip(1),
      filter(params => this.isNotLoaded),
      tap(() => this.isNotLoaded = false)
    )
    .subscribe(params => {
      this.loadStateFrom(params);
    });

    this.store$.select(uiStore.getUIState).pipe(
      skip(1),
      map(uiState => ({
        isSidebarOpen: uiState.isSidebarOpen,
        selectedFilter: uiState.selectedFilter,
      }))
    ).subscribe(this.updateRouteWithParams);

    this.store$.select(filterStore.getSelectedPlatformNames).pipe(
      skip(1),
      map(platforms => ({
        selectedPlatforms: Array.from(platforms).join(','),
      }))
    ).subscribe(this.updateRouteWithParams);

    this.store$.select(mapStore.getMapState).pipe(
      skip(1),
      map(mapState => ({ view: mapState.view }))
    ).subscribe(this.updateRouteWithParams);

    this.mapService.center$.pipe(
      skip(1),
      map(center => ({ center: `${center.lon},${center.lat}` }))
    ).subscribe(this.updateRouteWithParams);

    this.mapService.zoom$.pipe(
      skip(1),
      map(zoom => ({ zoom }))
    ).subscribe(this.updateRouteWithParams);

    this.mapService.searchPolygon$.pipe(
      map(polygon => ({ polygon }))
    )
    .subscribe(this.updateRouteWithParams);
  }

  private updateRouteWithParams = (queryParams: Params): void => {
    this.params = {...this.params, ...queryParams};

    this.router.navigate(['.'], {
      queryParams: this.params,
    });
  }

  private loadStateFrom(params: Params): void {
    this.params = { ...this.params, ...params };

    const urlParamLoaders: { [id: string]: (string) => void } = {
      isSidebarOpen: this.loadIsSidebarOpen,
      selectedFilter: this.loadSelectedFilter,
      view: this.loadMapView,
      zoom: this.loadMapZoom,
      center: this.loadMapCenter,
      selectedPlatforms: this.loadSelectedPlatforms,
      polygon: this.loadSearchPolygon,
    };

    Object.entries(urlParamLoaders)
    .map(
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
    const format = new WKT();
    const granuleProjection = 'EPSG:4326';

    const features = format.readFeature(polygon, {
      dataProjection: granuleProjection,
      featureProjection: this.mapService.epsg()
    });

    this.mapService.addDrawFeature(features);
  }

  private isNumber = n => !isNaN(n) && isFinite(n);
}
