import { Injectable } from '@angular/core';
import { CMRProduct, SearchType } from '@models';


import * as models from '@models';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MapService } from '@services';
import { AppState } from '@store';
import { getImageBrowseProducts, getPinnedEventBrowseIDs, getProducts, getSelectedSarviewsEventProducts, getSelectedScene } from '@store/scenes';
import { ScenesActionType, SetImageBrowseProducts, SetSelectedScene } from '@store/scenes/scenes.action';
import { getareResultsOutOfDate, getSearchType, SearchActionType, SetSearchOutOfDate, SetSearchType } from '@store/search';
import { filter, first, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { MapActionType, SetBrowseOverlayOpacity, SetBrowseOverlays, ToggleBrowseOverlay } from '.';
import { PinnedProduct } from '@services/browse-map.service';
import { getSelectedDataset } from '@store/filters';
import { getIsFiltersMenuOpen, getIsResultsMenuOpen } from '@store/ui';
@Injectable()
export class MapEffects {

  public constructor(private actions$: Actions,
    private mapService: MapService,
    private store$: Store<AppState>) {}

  public clearPinnedProducts = createEffect((() => this.actions$.pipe(
    ofType(SearchActionType.SET_SEARCH_TYPE_AFTER_SAVE,
      SearchActionType.MAKE_SEARCH,
      MapActionType.CLEAR_BROWSE_OVERLAYS,
      ScenesActionType.SET_SELECTED_SARVIEWS_EVENT),
    tap(_ => this.mapService.clearBrowseOverlays()),
    map(_ => new SetImageBrowseProducts({}))
  )));

  public setSearchOverlays = createEffect(() => this.actions$.pipe(
    ofType<SetImageBrowseProducts>(ScenesActionType.SET_IMAGE_BROWSE_PRODUCTS),
    withLatestFrom(this.store$.select(getSearchType)),
    filter(([_, searchtype]) => searchtype === models.SearchType.SARVIEWS_EVENTS),
    tap(([action, _]) => this.mapService.setPinnedProducts(action.payload)),
  ), {dispatch: false});

  public onSetBrowseOpacity = createEffect( () => this.actions$.pipe(
    ofType<SetBrowseOverlayOpacity>(MapActionType.SET_BROWSE_OVERLAY_OPACITY),
    tap(action => this.mapService.updateBrowseOpacity(action.payload))
  ), {dispatch: false});

  public onSetSelectedScene = createEffect(() => this.actions$.pipe(
    ofType<SetSelectedScene>(ScenesActionType.SET_SELECTED_SCENE),
    map(action => action.payload),
    withLatestFrom(this.store$.select(getSearchType)),
    filter(([_, searchtype]) => searchtype !== models.SearchType.SARVIEWS_EVENTS),
    // map(([selected_scene, _]) => selected_scene),
    withLatestFrom(this.store$.select(getSelectedDataset)),
    filter(([[_, searchType], dataset]) => {
    if (searchType === SearchType.DATASET) {
      return dataset?.id === 'AVNIR'
      || dataset?.id === 'ALOS'
      || dataset?.id === 'SENTINEL-1'
      || dataset?.id === 'SENTINEL-1 INTERFEROGRAM (BETA)'
      || dataset?.id === 'UAVSAR';
    }
    return searchType !== SearchType.BASELINE && searchType !== SearchType.SBAS;
  }),
    map(([[selectedSceneID, _], __]) => selectedSceneID),
    filter(sceneID => !!sceneID),
    withLatestFrom(this.store$.select(getProducts)),
    filter(([selected, products]) => !!selected && !!products),
    filter(([selected, products]) => products[selected]?.browses.length > 0),
    map(([selected, products]) => products[selected]),
    withLatestFrom(this.store$.select(getSearchType)),
    filter(([product, searchType]) => {
      if (searchType === SearchType.LIST) {
        return product.dataset === 'ALOS'
        || product.dataset === 'Sentinel-1A'
        || product.dataset === 'Sentinel-1B'
        || product.dataset === 'Sentinel-1 Interferogram (BETA)'
        || product.dataset === 'UAVSAR';
      }
      return true;
    }),
    map(([product, _]) => product),
    filter(product => product.browses.length > 0),
    tap((selectedProduct: CMRProduct) => {
      if(selectedProduct.dataset === 'ALOS') {
        if(selectedProduct.metadata.productType !== 'RTC_LOW_RES'
          && selectedProduct.metadata.productType !== 'RTC_HI_RES') {
            return;
          }
      }
      if (selectedProduct.browses[0] !== '/assets/no-browse.png') {
        this.mapService.setSelectedBrowse(selectedProduct.browses[0], selectedProduct.metadata.polygon);
      }
    }),
  ), {dispatch: false});

  public pinEventProductOnSelection = createEffect(() => this.actions$.pipe(
    ofType<SetSearchType>(SearchActionType.SET_SEARCH_TYPE_AFTER_SAVE),
    filter(action => action.payload === SearchType.SARVIEWS_EVENTS),
    withLatestFrom(this.store$.select(getPinnedEventBrowseIDs)),
    map(([_, browseIDs]) => browseIDs),
    withLatestFrom(this.store$.select(getSelectedSarviewsEventProducts)),
    map(([pinned, eventProducts]) => {
      const pinnedProducts = {};
      eventProducts.filter(prod => pinned.includes(prod.product_id)
      ).forEach(prod => pinnedProducts[prod.product_id] = {
        url: prod.files.browse_url,
        wkt: prod.granules[0].wkt,
      });

      return pinnedProducts;
    }),
    map(products => new SetImageBrowseProducts(products))
    ));

  public onPinSelectedEventProduct = createEffect(() => this.actions$.pipe(
    ofType<ToggleBrowseOverlay>(MapActionType.TOGGLE_BROWSE_OVERLAY),
    map(action => action.payload),
    withLatestFrom(this.store$.select(getSearchType)),
    withLatestFrom(this.store$.select( getSelectedSarviewsEventProducts)),
    withLatestFrom(this.store$.select( getSelectedScene)),
    map(([[[selectedProductId, searchType], products], scene]) => {
        if (searchType === models.SearchType.SARVIEWS_EVENTS) {
          const targetProduct = products.find(prod => prod.product_id === selectedProductId);
          const url = targetProduct?.files.browse_url;
          const wkt = targetProduct?.granules[0].wkt;

          return { selectedProductId, product: {url, wkt} as PinnedProduct};
        } else {
          const url = scene?.browses[0];
          const wkt = scene?.metadata.polygon;
          return { selectedProductId, product: {url, wkt} as PinnedProduct};
        }
      }
    ),
    withLatestFrom(this.store$.select(getImageBrowseProducts)),
    map(([pin, pinnedProducts]) => {
      const temp: {[product_id in string]: PinnedProduct} = JSON.parse(JSON.stringify(pinnedProducts));
      if (!!pinnedProducts[pin.selectedProductId]) {
        delete temp[pin.selectedProductId];
      } else {
        temp[pin.selectedProductId] = pin.product;
      }

      return temp;
    }),
    map(pinnedProducts => new SetImageBrowseProducts(pinnedProducts))
  ));

  public LoadBrowseOverlaysOnLoad = createEffect(() => this.actions$.pipe(
    ofType<SetBrowseOverlays>(MapActionType.SET_BROWSE_OVERLAYS),
    map(action => action.payload),
    first(),
    switchMap(browseIds => this.store$.select( getSelectedSarviewsEventProducts).pipe(filter(
      products => products.length > 0
    ),
    map(products => ({browseIds, products})))),
    first(),
    filter(val => val.products.length > 0),
    map((data) => {
      const selectedProductIds = data.browseIds;
      const products = data.products;

      return selectedProductIds.map(selectedProductId => {
        const targetProduct = products.find(prod => prod.product_id === selectedProductId);
        const url = targetProduct?.files.browse_url;
        const wkt = targetProduct?.granules[0].wkt;

      return { selectedProductId, product: {url, wkt} as PinnedProduct};
      });
    }),
    map(
      products => products.reduce((prev, curr) => {
        prev[curr.selectedProductId] = curr.product;
        return prev;
      }, {} as {[product_id in string]: PinnedProduct})
    ),
    tap(products => this.store$.dispatch(new SetImageBrowseProducts(products)))
  ),  {dispatch: false});

  public OnDrawNewPolygon = createEffect(() => this.actions$.pipe(
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
        resultsOpen
      })),
    filter(
      ({outOfDate}) => !outOfDate
    ),
    filter(({searchType}) => searchType === models.SearchType.DATASET),
    map(({filtersOpen, resultsOpen}) =>
      !filtersOpen
      && resultsOpen
    ),
    tap(_ => this.store$.dispatch( new SetSearchOutOfDate(true)))
  ), {dispatch: false});
}

