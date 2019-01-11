import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Store, Action } from '@ngrx/store';

import { combineLatest, Subscription } from 'rxjs';
import { filter, map, switchMap, skip } from 'rxjs/operators';

import { AppState } from './../../store';
import * as granulesStore from './../../store/granules';
import * as mapStore from './../../store/map';
import * as uiStore from './../../store/ui';
import * as filterStore from './../../store/filters';

import { MapService } from './../../services';
import * as models from './../../models';


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
    this.activatedRoute.queryParams.subscribe(params => {
        if (this.isNotLoaded) {
          this.isNotLoaded = false;
          this.loadStateFrom(params);
        }
      });

    this.store$.select(uiStore.getUIState).pipe(
      skip(1),
      map(uiState => ({
          isFiltersMenuOpen: uiState.isFiltersMenuOpen,
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

  }

  private updateRouteWithParams = (queryParams: Params): void => {
    this.params = {...this.params, ...queryParams};

    this.router.navigate(['.'], {
      queryParams: this.params,
    });
  }

  private loadStateFrom(params: Params): void {
    this.params = { ...this.params, ...params };

    if (params.isFiltersMenuOpen) {
      const action = params.isFiltersMenuOpen !== 'false' ?
        new uiStore.OpenFiltersMenu() :
        new uiStore.CloseFiltersMenu();

      this.store$.dispatch(action);
    }

    if (params.selectedFilter) {
      const selected = params.selectedFilter;

      if (Object.values(models.FilterType).includes(selected)) {

        const action = new uiStore.SetSelectedFilter(<models.FilterType>selected);
        this.store$.dispatch(action);
      }
    }

    if (params.view) {
      const view = params.view;

      if (Object.values(models.MapViewType).includes(view)) {
        const action = new mapStore.SetMapView(<models.MapViewType>view);

        this.store$.dispatch(action);
      }
    }

    if (params.zoom) {
      const zoom = +params.zoom;

      if (this.isNumber(zoom)) {
        this.mapService.setZoom(zoom);
      }
    }

    if (params.center) {
      const center = params.center.split(',').map(v => +v);

      if (center.length === 2 && center.every(this.isNumber)) {
        const [lon, lat] = center;

        this.mapService.setCenter({ lon, lat });
      }
    }

    if (params.selectedPlatforms) {
      const platforms = params.selectedPlatforms;

      const selectedPlatforms = platforms
        .split(',')
        .filter(name => models.platformNames.includes(name));

      const action = new filterStore.SetSelectedPlatforms(selectedPlatforms);

      this.store$.dispatch(action);
    }
  }

  private isNumber = n => !isNaN(n) && isFinite(n);
}
