import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Store, Action } from '@ngrx/store';

import { combineLatest } from 'rxjs';
import { filter, map, switchMap, skip, tap } from 'rxjs/operators';

import { AppState } from './store';
import * as granulesStore from './store/granules';
import * as mapStore from './store/map';
import * as uiStore from './store/ui';
import * as filterStore from './store/filters';

import { AsfApiService, RoutedSearchService } from './services';

import * as models from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public granules$ = this.store$.select(granulesStore.getGranules);
  public loading$  = this.store$.select(granulesStore.getLoading);
  public view$ = this.store$.select(mapStore.getMapView);

  public urlAppState$ = combineLatest(
    this.store$.select(uiStore.getUIState),
    this.store$.select(filterStore.getSelectedPlatformNames),
    this.store$.select(mapStore.getMapState),
    this.activatedRoute.queryParams
  );

  private isNotLoaded = true;

  constructor(
    private routedSearchService: RoutedSearchService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store$: Store<AppState>
  ) {
    this.routedSearchService.query('');

    this.urlAppState$.pipe(
      skip(1),
      map(state => {
        const urlParams = state.pop();
        if (this.isNotLoaded) {
          this.isNotLoaded = false;
          this.loadStateFrom(urlParams);
        }
        return state;
      }),
      map(state => {
        const [uiState, selectedPlatforms, mapState] = state;

        return {
          ...uiState,
          ...mapState,
          selectedPlatforms: Array.from(selectedPlatforms).join(','),
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
      this.onNewMapView(mapView);
    }
  }

  public onNewSearch(query: string): void {
    this.routedSearchService.query(query);
  }

  public onClearGranules(): void {
    this.routedSearchService.clear();
    this.store$.dispatch(new granulesStore.ClearGranules());
  }

  public onNewMapView(view: models.MapViewType): void {
    const newMapViewAction = this.getActionFor(view);
    this.store$.dispatch(newMapViewAction);
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
