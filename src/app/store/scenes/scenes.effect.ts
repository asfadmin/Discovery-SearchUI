import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { map, switchMap, catchError, distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UnzipApiService } from '@services/unzip-api.service';
import { NotificationService } from '@services/notification.service';

import { CMRProduct } from '@models';
import {
  ScenesActionType, LoadUnzippedProduct,
  AddUnzippedProduct, ErrorLoadingUnzipped
} from './scenes.action';
import { SetImageBrowseProducts, SetSarviewsEventProducts, SetSelectedSarviewsEvent } from '.';
import { MapService, SarviewsEventsService } from '@services';

@Injectable()
export class ScenesEffects {
  constructor(
    private actions$: Actions,
    private unzipApi: UnzipApiService,
    private notificationService: NotificationService,
    private sarviewsService: SarviewsEventsService,
    private mapService: MapService,
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

  public clearBrowseOverlaysOnNewEvent = createEffect(() => this.actions$.pipe(
    ofType<SetSelectedSarviewsEvent>(ScenesActionType.SET_SELECTED_SARVIEWS_EVENT),
    map(_ => new SetImageBrowseProducts({})),
    tap(_ => this.mapService.clearBrowseOverlays())
  ));

  private showUnzipApiLoadError(product: CMRProduct): void {
    this.notificationService.error(
      `Error loading files for ${product.id}`,
      'Error',
      { timeOut: 5000 }
    );
  }
}
