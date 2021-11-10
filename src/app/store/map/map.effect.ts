import { Injectable } from '@angular/core';
import { SearchType } from '@models';


import * as models from '@models';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MapService } from '@services';
import { AppState } from '@store';
import { getImageBrowseProducts, getPinnedEventBrowseIDs, getProducts, getSelectedSarviewsEventProducts, getSelectedScene } from '@store/scenes';
import { ScenesActionType, SetImageBrowseProducts, SetSelectedSarviewsEvent, SetSelectedScene } from '@store/scenes/scenes.action';
import { getSearchType, SearchActionType, SetSearchType } from '@store/search';
import { filter, map, tap, withLatestFrom } from 'rxjs/operators';
import { MapActionType, SetBrowseOverlayOpacity, SetBrowseOverlays, ToggleBrowseOverlay } from '.';
import { PinnedProduct } from '@services/browse-map.service';
import { getSelectedDataset } from '@store/filters';
@Injectable()
export class MapEffects {

  public constructor(private actions$: Actions,
    private mapService: MapService,
    private store$: Store<AppState>) {}
  public clearBrowseOverlaysOnNewEvent = createEffect(() => this.actions$.pipe(
    ofType<SetSelectedSarviewsEvent>(ScenesActionType.SET_SELECTED_SARVIEWS_EVENT),
    map(_ => new SetImageBrowseProducts({})),
    tap(_ => this.mapService.clearBrowseOverlays())
  ));

  public clearPinnedProducts = createEffect((() => this.actions$.pipe(
    ofType(SearchActionType.SET_SEARCH_TYPE_AFTER_SAVE, SearchActionType.MAKE_SEARCH),
    tap(_ => this.mapService.clearBrowseOverlays()),
    map(_ => new SetImageBrowseProducts({}))
  )));

  public setSearchOverlays = createEffect(() => this.actions$.pipe(
    ofType<SetImageBrowseProducts>(ScenesActionType.SET_IMAGE_BROWSE_PRODUCTS),
    withLatestFrom(this.store$.select(getSearchType)),
    tap(([action, _]) => this.mapService.setPinnedProducts(action.payload)),
  ), {dispatch: false});

  public onSetBrowseOpacity = createEffect( () => this.actions$.pipe(
    ofType<SetBrowseOverlayOpacity>(MapActionType.SET_BROWSE_OVERLAY_OPACITY),
    tap(action => this.mapService.updateBrowseOpacity(action.payload))
  ), {dispatch: false});

  public onSetSelectedScene = createEffect(() => this.actions$.pipe(
    ofType<SetSelectedScene>(ScenesActionType.SET_SELECTED_SCENE),
    withLatestFrom(this.store$.select(getSelectedDataset)),
    filter(([_, dataset]) =>
      dataset.id === 'AVNIR'
      || dataset.id === 'SENTINEL-1'
      || dataset.id === 'SENTINEL-1 INTERFEROGRAM (BETA)'
      || dataset.id === 'UAVSAR'),
    map(([action, _]) => action.payload),
    filter(scene => !!scene),
    withLatestFrom(this.store$.select(getProducts)),
    filter(([selected, products]) => !!selected && !!products),
    filter(([selected, products]) => products[selected].browses.length > 0),
    tap(([selected, products]) => this.mapService.setSelectedBrowse(products[selected].browses[0], products[selected].metadata.polygon)),
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
        if(searchType === models.SearchType.SARVIEWS_EVENTS) {
          const targetProduct = products.find(prod => prod.product_id === selectedProductId);
          const url = targetProduct?.product_id;
          const wkt = targetProduct?.granules[0].wkt;

          return { selectedProductId, product: {url, wkt} as PinnedProduct}
        } else {
          const url = scene?.browses[0];
          const wkt = scene?.metadata.polygon;
          return { selectedProductId, product: {url, wkt} as PinnedProduct}
        }
      }
    ),
    withLatestFrom(this.store$.select(getImageBrowseProducts)),
    map(([pin, pinnedProducts]) => {
      let temp: {[product_id in string]: PinnedProduct} = JSON.parse(JSON.stringify(pinnedProducts));
      if(!!pinnedProducts[pin.selectedProductId]) {
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
    withLatestFrom(this.store$.select(getSearchType)),
    withLatestFrom(this.store$.select( getSelectedSarviewsEventProducts)),
    withLatestFrom(this.store$.select( getSelectedScene)),
    map(([[[selectedProductIds, searchType], products], scene]) => {

      if(searchType === models.SearchType.SARVIEWS_EVENTS) {
        return selectedProductIds.map(selectedProductId => {
          const targetProduct = products.find(prod => prod.product_id === selectedProductId);
          const url = targetProduct?.product_id;
          const wkt = targetProduct?.granules[0].wkt;

        return { selectedProductId, product: {url, wkt} as PinnedProduct}
        });
      } else {
        return selectedProductIds.map(selectedProductId => {
        const url = scene?.browses[0];
        const wkt = scene?.metadata.polygon;
        return { selectedProductId, product: {url, wkt} as PinnedProduct}
        });
      }
    }),
    map(
      products => products.reduce((prev, curr) => {
        prev[curr.selectedProductId] = curr.product;
        return prev;
      }, {} as {[product_id in string]: PinnedProduct})
    )
  ),  {dispatch: false});
}

