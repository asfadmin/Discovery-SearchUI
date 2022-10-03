import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { map, switchMap, catchError, distinctUntilChanged, filter, withLatestFrom } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UnzipApiService } from '@services/unzip-api.service';
import { NotificationService } from '@services/notification.service';

import { CMRProduct, SearchType } from '@models';
import {
  ScenesActionType, LoadUnzippedProduct,
  AddUnzippedProduct, ErrorLoadingUnzipped, SetScenes, SetSelectedScene
} from './scenes.action';
import { allScenesFrom, getSelectedScene, SetSarviewsEventProducts, SetSelectedSarviewsEvent } from '.';
import { SarviewsEventsService } from '@services';
import { AppState } from '@store/app.reducer';
import { Store } from '@ngrx/store';

@Injectable()
export class ScenesEffects {
  constructor(
    private actions$: Actions,
    private unzipApi: UnzipApiService,
    private notificationService: NotificationService,
    private sarviewsService: SarviewsEventsService,
    private store$: Store<AppState>
  ) {}

  public loadUnzippedProductFiles = createEffect(() => this.actions$.pipe(
    ofType<LoadUnzippedProduct>(ScenesActionType.LOAD_UNZIPPED_PRODUCT),
    switchMap(action => this.unzipApi.load$(action.payload.downloadUrl).pipe(
      map(resp => resp.response),
      map(resp =>
        (resp.length === 1 && resp[0].type === 'dir') ?
          resp.pop().contents :
          resp
      ),
      map(resp => ({
        product: action.payload,
        unzipped: resp
      })
      ),
      map(unzipped => new AddUnzippedProduct(unzipped)),
      catchError(_ => of(new ErrorLoadingUnzipped(action.payload))),
    )),
  )
  );

  public errorLoadingUnzip = createEffect(() => this.actions$.pipe(
    ofType<ErrorLoadingUnzipped>(ScenesActionType.ERROR_LOADING_UNZIPPED),
    map(action => this.showUnzipApiLoadError(action.payload))
  ), { dispatch: false });

  public loadSarviewsEventProductsOnSelect = createEffect(() => this.actions$.pipe(
    ofType<SetSelectedSarviewsEvent>(ScenesActionType.SET_SELECTED_SARVIEWS_EVENT),
    distinctUntilChanged(),
    switchMap(action => this.sarviewsService.getEventFeature(action.payload)),
    // debounceTime(500),
    filter(event => !!event.products),
    map(processedEvent => new SetSarviewsEventProducts(!!processedEvent.products ? processedEvent.products : []))
  ));

  private showUnzipApiLoadError(product: CMRProduct): void {
    this.notificationService.error(
      `Error loading files for ${product.id}`,
      'Error',
      { timeOut: 5000 }
    );
  }

  public setSelectedSceneOnLoad = createEffect(() => this.actions$.pipe(
    ofType<SetScenes>(ScenesActionType.SET_SCENES),
    // distinctUntilChanged(),
    withLatestFrom(this.store$.select(getSelectedScene)),
    map(([action, selected]) => {
      const products = action.payload.products
      .reduce((total, product) => {
        total[product.id] = product;

        return total;
      }, {});

      let current_selected = selected?.id ?? null;

      if (action.payload.searchType === SearchType.BASELINE) {
        Object.values(products).forEach((product: CMRProduct) => {
          if (product.metadata.temporal === 0 && product.metadata.perpendicular === 0) {
            current_selected = product.id;
          }
        });
      }
      const productGroups: {[id: string]: string[]} = action.payload.products.reduce((total, product) => {
        const scene = total[product.groupId] || [];

        total[product.groupId] = [...scene, product.id];
        return total;
      }, {});

      const scenes: {[id: string]: string[]} = {};
      for (const [groupId, productNames] of Object.entries(productGroups)) {

        (<string[]>productNames).sort(
          (a, b) => products[a].bytes - products[b].bytes
        ).reverse();

        scenes[groupId] = Array.from(new Set(productNames)) ;
      }

      if (current_selected === null) {
        const sceneList = allScenesFrom(scenes, products);
        const firstScene = sceneList[0];

        if (firstScene) {
          current_selected = firstScene.id;
        }
      }

      this.store$.dispatch(new SetSelectedScene(current_selected))
    })
  ), {dispatch: false})
}
