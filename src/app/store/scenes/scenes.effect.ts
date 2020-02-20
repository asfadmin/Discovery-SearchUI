import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { of } from 'rxjs';
import { map, withLatestFrom, switchMap, catchError, filter } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { UnzipApiService } from '@services/unzip-api.service';

import { CMRProduct } from '@models';
import { AppState } from '../app.reducer';
import { ScenesActionType, LoadUnzippedProduct, AddUnzippedProduct } from './scenes.action';

@Injectable()
export class ScenesEffects {
  constructor(
    private actions$: Actions,
    private store$: Store<AppState>,
    private unzipApi: UnzipApiService,
    private snackBar: MatSnackBar,
  ) {}

  private clearMapInteractionModeOnSearch = createEffect(() => this.actions$.pipe(
    ofType<LoadUnzippedProduct>(ScenesActionType.LOAD_UNZIPPED_PRODUCT),
    switchMap(action => this.unzipApi.load$(action.payload.downloadUrl).pipe(
      catchError(err => {
        this.showUnzipApiLoadError(action.payload);
        return of(null);
      }),
      filter(resp => !!resp),
      map(resp => ({
        product: action.payload,
        unzipped: resp
      })
      )
    )),
    map(unzipped => new AddUnzippedProduct(unzipped))
  ));

  private showUnzipApiLoadError(product: CMRProduct): void {
    this.snackBar.open(
      `Error loading files for ${product.id}`,
      'ERROR',
      { duration: 5000 }
    );
  }
}
