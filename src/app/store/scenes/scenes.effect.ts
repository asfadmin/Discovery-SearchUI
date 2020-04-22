import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { UnzipApiService } from '@services/unzip-api.service';

import { CMRProduct } from '@models';
import { AppState } from '../app.reducer';
import {
  ScenesActionType, LoadUnzippedProduct,
  AddUnzippedProduct, ErrorLoadingUnzipped
} from './scenes.action';

@Injectable()
export class ScenesEffects {
  constructor(
    private actions$: Actions,
    private store$: Store<AppState>,
    private unzipApi: UnzipApiService,
    private snackBar: MatSnackBar,
  ) {}

  private loadUnzippedProductFiles = createEffect(() => this.actions$.pipe(
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
      catchError(err => of(new ErrorLoadingUnzipped(action.payload))),
    )),
  )
  );

  private errorLoadingUnzip = createEffect(() => this.actions$.pipe(
    ofType<ErrorLoadingUnzipped>(ScenesActionType.ERROR_LOADING_UNZIPPED),
    map(action => this.showUnzipApiLoadError(action.payload))
  ), { dispatch: false });

  private showUnzipApiLoadError(product: CMRProduct): void {
    this.snackBar.open(
      `Error loading files for ${product.id}`,
      'ERROR',
      { duration: 5000 }
    );
  }
}
