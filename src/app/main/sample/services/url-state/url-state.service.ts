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
  private isNotLoaded = true;

  constructor(
    private store$: Store<AppState>,
    private mapService: MapService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
  const urlAppState$ = combineLatest(
    this.store$.select(uiStore.getUIState),
    this.store$.select(filterStore.getSelectedPlatformNames),
    this.store$.select(mapStore.getMapState),
    this.mapService.center$,
    this.mapService.zoom$,
    this.activatedRoute.queryParams,
  );

  urlAppState$.pipe(
      skip(1),
      map(state => {
        const params: Params = state.pop();

        if (this.isNotLoaded) {
          this.isNotLoaded = false;
          this.loadStateFrom(params);
        }

        state.push(params);

        return state;
      }),
      map(state => {
        const [
          uiState, currentSelectedPlatforms,
          mapState, center, zoom, params
        ] = state;
        console.log(zoom, center);

        return {
          isFiltersMenuOpen: uiState.isFiltersMenuOpen,
          selectedFilter: uiState.selectedFilter,

          view: mapState.view,
          center: `${center.lon},${center.lat}`,
          zoom,

          selectedPlatforms: Array.from(currentSelectedPlatforms).join(','),

          granuleList: params.granuleList
        };
      })
    ).subscribe(
      queryParams => {
        this.router.navigate(['.'], { queryParams });
      }
    );
  }

  private loadStateFrom(params: Params): void {
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
