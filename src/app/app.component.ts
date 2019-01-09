import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Store, Action } from '@ngrx/store';

import { combineLatest } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { AppState } from './store';
import * as granulesStore from './store/granules';
import * as mapStore from './store/map';
import * as uiStore from './store/ui';
import * as filterStore from './store/filters';

import { AsfApiService, RoutedSearchService } from './services';

import { SentinelGranule, MapViewType, FilterType } from './models';

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
  );

  constructor(
    private routedSearchService: RoutedSearchService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store$: Store<AppState>
  ) {
    this.routedSearchService.query('');

    this.activatedRoute.queryParams.pipe(
      map(urlParams => {
        this.loadStateFrom(urlParams);

        return urlParams;
      }
    )).subscribe(
      queryParams => queryParams
    );
  }

  private loadStateFrom(urlParams: Params): void {
    if (urlParams.isFiltersMenuOpen) {
      const isFiltersMenuOpen = JSON.parse(urlParams.isFiltersMenuOpen);

      const menuAction = isFiltersMenuOpen ?
        new uiStore.OpenFiltersMenu() :
        new uiStore.CloseFiltersMenu();

      this.store$.dispatch(menuAction);
    }
    if (urlParams.selectedFilter) {
      const selectedFilter = <FilterType>urlParams.selectedFilter;

      this.store$.dispatch(new uiStore.SetSelectedFilter(selectedFilter));
    }
    if (urlParams.selectedPlatforms) {
      const selectedPlatforms = urlParams.selectedPlatforms.split(',');

      this.store$.dispatch(new filterStore.SetSelectedPlatforms(selectedPlatforms));
    }
    if (urlParams.view) {
      const mapView = <MapViewType>urlParams.view;
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

  public onNewMapView(view: MapViewType): void {
    const newMapViewAction = this.getActionFor(view);
    this.store$.dispatch(newMapViewAction);
  }

  private getActionFor(view: MapViewType): Action {
    switch (view) {
      case MapViewType.ARCTIC: {
        return new mapStore.SetArcticView();
      }
      case MapViewType.EQUITORIAL: {
        return new mapStore.SetEquitorialView();
      }
      case MapViewType.ANTARCTIC: {
        return new mapStore.SetAntarcticView();
      }
    }
  }
}
