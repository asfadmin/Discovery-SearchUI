import { Injectable, inject } from '@angular/core';
import { SearchType } from '@models';

import * as models from '@models';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MapService } from '@services';
import { AppState } from '@store';
import { getAreResultsLoaded, getProducts } from '@store/scenes';
import {
  ScenesActionType,
  SetSelectedScene,
} from '@store/scenes/scenes.action';
import {
  getareResultsOutOfDate,
  getSearchType,
  SearchActionType,
  SetSearchOutOfDate,
  SetSearchType,
} from '@store/search';
import { filter, map, tap, withLatestFrom } from 'rxjs/operators';
import { MapActionType, SetBrowseOverlayOpacity } from '.';
import { getSelectedDataset } from '@store/filters';
import { getIsFiltersMenuOpen, getIsResultsMenuOpen } from '@store/ui';
import { ClearBrowseOverlays, SetCoherenceOverlayOpacity } from './map.action';
import { getIsUserLoggedIn } from '@store/user';
@Injectable()
export class MapEffects {
  private actions$ = inject(Actions);
  private mapService = inject(MapService);
  private store$ = inject<Store<AppState>>(Store);

  public onSetBrowseOpacity = createEffect(
    () =>
      this.actions$.pipe(
        ofType<SetBrowseOverlayOpacity>(
          MapActionType.SET_BROWSE_OVERLAY_OPACITY,
        ),
        tap((action) => this.mapService.updateBrowseOpacity(action.payload)),
      ),
    { dispatch: false },
  );

  public onSetCoherenceOpacity = createEffect(
    () =>
      this.actions$.pipe(
        ofType<SetCoherenceOverlayOpacity>(
          MapActionType.SET_COHERENCE_OVERLAY_OPACITY,
        ),
        tap((action) => this.mapService.updateCoherenceOpacity(action.payload)),
      ),
    { dispatch: false },
  );

  public onSetVelocityOpacity = createEffect(
    () =>
      this.actions$.pipe(
        ofType<SetCoherenceOverlayOpacity>(
          MapActionType.SET_VELOCITY_OVERLAY_OPACITY,
        ),
        tap((action) => this.mapService.updateVelocityOpacity(action.payload)),
      ),
    { dispatch: false },
  );

  public onSearchTypeChanged2 = createEffect(
    () =>
      this.actions$.pipe(
        ofType<SetSearchType>(SearchActionType.SET_SEARCH_TYPE),
        withLatestFrom(this.store$.select(getSearchType)),
        tap(([action, search_type]) => {
          if (
            search_type === SearchType.DISPLACEMENT &&
            action.payload !== SearchType.DISPLACEMENT
          ) {
            this.mapService.clearTimeseriesOverlay();
          }
        }),
      ),
    { dispatch: false },
  );

  public onSetSelectedScene = createEffect(
    () =>
      this.actions$.pipe(
        ofType<SetSelectedScene>(ScenesActionType.SET_SELECTED_SCENE),
        map((action) => action.payload),
        withLatestFrom(this.store$.select(getSearchType)),

        // map(([selected_scene, _]) => selected_scene),
        withLatestFrom(this.store$.select(getSelectedDataset)),
        filter(([[_, searchType], dataset]) => {
          if (searchType === SearchType.DATASET) {
            return (
              dataset?.id === 'AVNIR' ||
              dataset?.id === 'ALOS' ||
              dataset?.id === 'SENTINEL-1' ||
              dataset?.id === 'SENTINEL-1 INTERFEROGRAM (BETA)' ||
              dataset?.id === 'UAVSAR' ||
              dataset?.id === 'OPERA-S1'
            );
          }
          return (
            searchType !== SearchType.BASELINE &&
            searchType !== SearchType.SBAS &&
            searchType !== SearchType.DISPLACEMENT
          );
        }),
        map(([[selectedSceneID, _], __]) => selectedSceneID),
        filter((sceneID) => !!sceneID),
        withLatestFrom(this.store$.select(getProducts)),
        filter(([selected, products]) => !!selected && !!products),
        filter(
          ([selected, products]) => products[selected]?.browses.length > 0,
        ),
        map(([selected, products]) => products[selected]),
        withLatestFrom(this.store$.select(getSearchType)),
        filter(([product, searchType]) => {
          if (searchType === SearchType.LIST) {
            const isAllowed =
              product.dataset === 'ALOS' ||
              product.dataset === 'Sentinel-1A' ||
              product.dataset === 'Sentinel-1B' ||
              product.dataset === 'Sentinel-1C' ||
              product.dataset === 'Sentinel-1 Interferogram (BETA)' ||
              product.dataset === 'UAVSAR';

            if (!isAllowed) {
              this.store$.dispatch(new ClearBrowseOverlays());
            }

            return isAllowed;
          } else if (searchType === SearchType.CUSTOM_PRODUCTS) {
            const failed =
              product.metadata.job?.status_code ===
              models.Hyp3JobStatusCode.FAILED;
            const running =
              product.metadata.job?.status_code ===
              models.Hyp3JobStatusCode.RUNNING;

            if (failed || running) {
              this.store$.dispatch(new ClearBrowseOverlays());
            }

            return !failed && !running;
          }
          return true;
        }),
        map(([product, _]) => product),
        filter((product) => product.browses.length > 0),
        withLatestFrom(this.store$.select(getIsUserLoggedIn)),
        tap(([selectedProduct, _loggedIn]) => {
          if (selectedProduct.dataset === 'ALOS') {
            if (
              selectedProduct.metadata.productType !== 'RTC_LOW_RES' &&
              selectedProduct.metadata.productType !== 'RTC_HI_RES'
            ) {
              return;
            }
          }
          if (selectedProduct.browses[0] !== '/assets/no-browse.png') {
            const url = selectedProduct.browses[0];

            // for OPERA-S1 geotiffs
            // TODO: Wait for https://github.com/openlayers/openlayers/pull/15402
            // if (loggedIn && selectedProduct.id.startsWith('OPERA') && selectedProduct.downloadUrl.endsWith('.tif')) {
            //   url = selectedProduct.downloadUrl
            // }

            this.mapService.setSelectedBrowse(
              url,
              selectedProduct.metadata.polygon,
              selectedProduct,
            );
          }
        }),
      ),
    { dispatch: false },
  );

  public OnDrawNewPolygon = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MapActionType.DRAW_NEW_POLYGON),
        withLatestFrom(
          this.store$.select(getareResultsOutOfDate),
          this.store$.select(getSearchType),
          this.store$.select(getIsFiltersMenuOpen),
          this.store$.select(getIsResultsMenuOpen),
          (_, outOfDate, searchType, filtersOpen, resultsOpen) => ({
            outOfDate,
            searchType,
            filtersOpen,
            resultsOpen,
          }),
        ),
        filter(({ outOfDate }) => !outOfDate),
        filter(({ searchType }) => searchType === models.SearchType.DATASET),
        map(({ filtersOpen, resultsOpen }) => !filtersOpen && resultsOpen),
        withLatestFrom(this.store$.select(getAreResultsLoaded)),
        tap(([loaded, _]) => {
          if (loaded) {
            return this.store$.dispatch(new SetSearchOutOfDate(true));
          }
        }),
      ),
    { dispatch: false },
  );
}
