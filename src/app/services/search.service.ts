import { Injectable, inject } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import {
  MakeSearch,
  ClearSearch,
  SetSearchType,
} from '@store/search/search.action';
import * as filterStore from '@store/filters';
import * as mapStore from '@store/map';
import * as uiStore from '@store/ui';

import * as models from '@models';
import { MapService } from './map/map.service';
import { WktService } from './wkt.service';
import { PinnedProduct } from './browse-map.service';
import { PointHistoryService } from './point-history.service';
import { resetTimeseriesStates } from '@store/charts';
import { SetProductTypes, SetSelectedDataset } from '@store/filters';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private store$ = inject<Store<AppState>>(Store);
  private mapService = inject(MapService);
  private wktService = inject(WktService);
  private pointHistoryService = inject(PointHistoryService);

  public clear(searchType: models.SearchType): void {
    this.mapService.clearDrawLayer();

    const actions = [
      new filterStore.ClearDatasetFilters(),
      new mapStore.SetMapInteractionMode(models.MapInteractionModeType.DRAW),
      // List
      new scenesStore.ClearBaseline(),
      new filterStore.ClearPerpendicularRange(),
      new filterStore.ClearTemporalRange(),
      new filterStore.ClearSeason(),
      new filterStore.SetUseFrameForBaseline(false),
    ];

    actions.forEach((action) => this.store$.dispatch(action));

    if (searchType === models.SearchType.CUSTOM_PRODUCTS) {
      this.store$.dispatch(new filterStore.SetProjectName(''));
      this.store$.dispatch(new filterStore.SetJobStatuses([]));
      this.store$.dispatch(new filterStore.ClearDateRange());
      this.store$.dispatch(new filterStore.SetProductNameFilter(''));
    }

    if (searchType === models.SearchType.SARVIEWS_EVENTS) {
      this.store$.dispatch(new filterStore.SetSarviewsEventNameFilter(''));
      this.store$.dispatch(new filterStore.SetSarviewsEventTypes([]));
      this.store$.dispatch(new filterStore.SetSarviewsEventActiveFilter(false));
      this.store$.dispatch(
        new filterStore.SetSarviewsMagnitudeRange({
          start: null,
          end: null,
        }),
      );
      this.store$.dispatch(new filterStore.ClearSarviewsMagnitudeRange());
      this.store$.dispatch(new filterStore.ClearHyp3ProductTypes());
    }
  }

  public load(search: models.Search) {
    this.store$.dispatch(new ClearSearch());
    this.store$.dispatch(new SetSearchType(search.searchType));

    this.loadSearch(search);

    this.store$.dispatch(new MakeSearch());
    this.store$.dispatch(new uiStore.CloseSidebar());
  }

  public loadSearch(search: models.Search) {
    if (search.searchType === models.SearchType.DATASET) {
      this.loadSearchPolygon(search);
    }
    if (search.searchType === models.SearchType.BASELINE) {
      const filters = search.filters as models.BaselineFiltersType;
      this.store$.dispatch(
        new scenesStore.SetFilterMaster(filters.filterMaster),
      );
    }
    if (search.searchType === models.SearchType.SBAS) {
      const filters = search.filters as models.SbasFiltersType;
      this.store$.dispatch(new scenesStore.SetFilterMaster(filters.reference));
      if (filters.customPairIds) {
        this.store$.dispatch(
          new scenesStore.AddCustomPairs(filters.customPairIds),
        );
      }
    }
    if (search.searchType === models.SearchType.SARVIEWS_EVENTS) {
      const filters = search.filters as models.SarviewsFiltersType;
      const pinnedProductIds = filters.pinnedProductIDs;
      this.store$.dispatch(
        new scenesStore.SetSelectedSarviewsEvent(filters.selectedEventID),
      );

      if (pinnedProductIds) {
        this.store$.dispatch(
          new scenesStore.SetImageBrowseProducts(
            pinnedProductIds.reduce(
              (prev, curr) => {
                prev[curr] = {
                  url: '',
                  wkt: '',
                };
                return prev;
              },
              {} as Record<string, PinnedProduct>,
            ),
          ),
        );
      }
    }
    if (search.searchType === models.SearchType.DISPLACEMENT) {
      const filters = search.filters as models.DisplacementFiltersType;
      this.store$.dispatch(resetTimeseriesStates());

      const seriesStates = filters.seriesStates;
      this.pointHistoryService.addPoints(Object.values(seriesStates));
    }

    this.store$.dispatch(new filterStore.SetSavedSearch(search));
  }

  private loadSearchPolygon(search: models.Search): void {
    const polygon = (search.filters as models.GeographicFiltersType).polygon;

    if (polygon === null) {
      this.mapService.clearDrawLayer();
    } else {
      const features = this.wktService.wktToFeature(
        polygon,
        this.mapService.epsg(),
      );

      this.mapService.setDrawFeature(features);
    }
  }

  public redirectSearch(redirectInfo: models.SearchRedirect) {
    switch (redirectInfo.searchType) {
      case models.SearchType.DATASET: {
        const filters = redirectInfo.filters;
        const dataset = models.datasetList.find(
          (d) => d.id === filters.selectedDataset,
        );

        const actions = [
          new SetSearchType(models.SearchType.DATASET),
          new ClearSearch(),
          new SetSelectedDataset(dataset.id),
          new SetProductTypes(filters.productTypes),
          new MakeSearch(),
        ];

        actions.forEach((action) => {
          this.store$.dispatch(action);
        });

        break;
      }
      default:
        console.log('unimplemented');
    }
  }
}
