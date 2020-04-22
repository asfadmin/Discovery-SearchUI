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

  public clear(searchType: models.SearchType, breakpoint: models.Breakpoints): void {
    if (searchType === models.SearchType.DATASET) {
      this.mapService.clearDrawLayer();

      const actions = [
        new filterStore.ClearDatasetFilters(),
        new mapStore.SetMapInteractionMode(models.MapInteractionModeType.DRAW),
      ];

      actions.forEach(
        action => this.store$.dispatch(action)
      );
    } else if (searchType === models.SearchType.LIST) {
      this.store$.dispatch(new filterStore.ClearListFilters());
    } else if (searchType === models.SearchType.BASELINE) {
      this.store$.dispatch(new scenesStore.ClearBaseline());
      this.store$.dispatch(new filterStore.ClearPerpendicularRange());
      this.store$.dispatch(new filterStore.ClearTemporalRange());
      if (breakpoint !== models.Breakpoints.MOBILE) {
        this.store$.dispatch(new uiStore.CloseFiltersMenu());
      }
    }
  }

  public load(search: models.Search) {
    this.store$.dispatch(new ClearSearch());
    this.store$.dispatch(new SetSearchType(search.searchType));

    if (search.searchType === models.SearchType.DATASET) {
      this.loadSearchPolygon(search);
    }
    if (search.searchType === models.SearchType.BASELINE) {
      const filters = <models.BaselineFiltersType>search.filters;
      this.store$.dispatch(new scenesStore.SetFilterMaster(filters.filterMaster));
    }

    this.store$.dispatch(new filterStore.SetSavedSearch(search));
    this.store$.dispatch(new uiStore.CloseSidebar());
    this.store$.dispatch(new MakeSearch());
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
