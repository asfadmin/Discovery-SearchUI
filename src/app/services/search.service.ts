import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import { MakeSearch, ClearSearch, SetSearchType } from '@store/search/search.action';
import * as filterStore from '@store/filters';
import * as mapStore from '@store/map';
import * as uiStore from '@store/ui';

import * as models from '@models';
import { MapService, } from './map/map.service';
import { WktService } from './wkt.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(
    private store$: Store<AppState>,
    private mapService: MapService,
    private wktService: WktService,
  ) { }

  public clear(searchType: models.SearchType): void {
    this.mapService.clearDrawLayer();

    const actions = [
      new filterStore.ClearDatasetFilters(),
      new mapStore.SetMapInteractionMode(models.MapInteractionModeType.DRAW),
      // new filterStore.ClearListFilters(),
      // // List
      // new filterStore.ClearListFilters(),
      // Baseline/SBAS
      new scenesStore.ClearBaseline(),
      new filterStore.ClearPerpendicularRange(),
      new filterStore.ClearTemporalRange(),
      new filterStore.ClearSeason(),
      new uiStore.CloseFiltersMenu(),
    ];

    actions.forEach(
      action => this.store$.dispatch(action)
    );

    if (searchType === models.SearchType.CUSTOM_PRODUCTS) {
      this.store$.dispatch(new filterStore.SetProjectName(''));
      this.store$.dispatch(new filterStore.SetJobStatuses([]));
      this.store$.dispatch(new filterStore.ClearDateRange());
      this.store$.dispatch(new filterStore.SetProductNameFilter(''));
    }
  }

  public load(search: models.Search) {
    this.store$.dispatch(new ClearSearch());
    this.store$.dispatch(new SetSearchType(search.searchType));

    this.loadSearch(search);

    this.store$.dispatch(new uiStore.CloseSidebar());
    this.store$.dispatch(new MakeSearch());
  }

  public loadSearch(search: models.Search) {
    if (search.searchType === models.SearchType.DATASET) {
      this.loadSearchPolygon(search);
    }
    if (search.searchType === models.SearchType.BASELINE) {
      const filters = <models.BaselineFiltersType>search.filters;
      this.store$.dispatch(new scenesStore.SetFilterMaster(filters.filterMaster));
    }
    if (search.searchType === models.SearchType.SBAS) {
      const filters = <models.SbasFiltersType>search.filters;
      this.store$.dispatch(new scenesStore.SetFilterMaster(filters.reference));
      if (filters.customPairIds) {
        this.store$.dispatch(new scenesStore.AddCustomPairs(filters.customPairIds));
      }
    }

    this.store$.dispatch(new filterStore.SetSavedSearch(search));
  }

  private loadSearchPolygon(search: models.Search): void {
    const polygon = (<models.GeographicFiltersType>search.filters).polygon;

    if (polygon === null) {
      this.mapService.clearDrawLayer();
    } else {
      const features =  this.wktService.wktToFeature(
        polygon,
        this.mapService.epsg()
      );

      this.mapService.setDrawFeature(features);
    }
  }
}
