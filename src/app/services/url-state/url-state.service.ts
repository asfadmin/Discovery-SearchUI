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

import * as models from './../../models';

@Injectable({
  providedIn: 'root'
})
export class UrlStateService {
  public urlAppState: Subscription;
  private isNotLoaded = true;

  constructor(
    private store$: Store<AppState>,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
  combineLatest(
    this.store$.select(uiStore.getUIState),
    this.store$.select(filterStore.getSelectedPlatformNames),
    this.store$.select(mapStore.getMapState),
    this.activatedRoute.queryParams
  ).pipe(
      skip(1),
      map(state => {
        const urlParams = state.pop();
        if (this.isNotLoaded) {
          this.isNotLoaded = false;
          this.loadStateFrom(urlParams);
        }
        state.push(urlParams);
        return state;
      }),
      map(state => {
        const [uiState, selectedPlatforms, mapState, urlParams] = state;

        return {
          ...uiState,
          ...mapState,
          selectedPlatforms: Array.from(selectedPlatforms).join(','),
          granuleList: urlParams.granuleList
        };
      })
    ).subscribe(
      queryParams => {
        this.router.navigate(['.'], { queryParams });
      }
    );
  }

  private loadStateFrom(urlParams: Params): void {
    if (urlParams.isFiltersMenuOpen) {
      const menuAction = urlParams.isFiltersMenuOpen === 'true' ?
        new uiStore.OpenFiltersMenu() :
        new uiStore.CloseFiltersMenu();

      this.store$.dispatch(menuAction);
    }

    if (urlParams.granuleList) {
      console.log(urlParams.granuleList.split(',').length);
    }

    if (urlParams.selectedFilter && Object.values(models.FilterType).includes(urlParams.selectedFilter)) {
      const selectedFilter = <models.FilterType>urlParams.selectedFilter;

      this.store$.dispatch(new uiStore.SetSelectedFilter(selectedFilter));
    }

    if (urlParams.selectedPlatforms) {
      const selectedPlatforms = urlParams.selectedPlatforms
        .split(',')
        .filter(name => models.platformNames.includes(name));

      this.store$.dispatch(new filterStore.SetSelectedPlatforms(selectedPlatforms));
    }

    if (urlParams.view && Object.values(models.MapViewType).includes(urlParams.view)) {
      const mapView = <models.MapViewType>urlParams.view;

      this.store$.dispatch(this.getActionFor(mapView));
    }
  }

  private getActionFor(view: models.MapViewType): Action {
    switch (view) {
      case models.MapViewType.ARCTIC: {
        return new mapStore.SetArcticView();
      }
      case models.MapViewType.EQUITORIAL: {
        return new mapStore.SetEquitorialView();
      }
      case models.MapViewType.ANTARCTIC: {
        return new mapStore.SetAntarcticView();
      }
    }
  }

}
