import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';

import { Observable, combineLatest } from 'rxjs';
import { map, withLatestFrom, startWith, switchMap, tap, filter } from 'rxjs/operators';

import { AppState } from '../app.reducer';
import { QueueActionType } from './queue.action';
import { getQueuedProducts } from './queue.reducer';

import * as services from '@services';
import * as models from '@models';

@Injectable()
export class QueueEffects {
  constructor(
    private actions$: Actions,
    private store$: Store<AppState>,
    private asfApiService: services.AsfApiService,
  ) {}

  @Effect({ dispatch: false })
  private makeDownloadScript: Observable<void> = this.actions$.pipe(
    ofType(QueueActionType.MAKE_DOWNLOAD_SCRIPT),
    withLatestFrom(this.store$.select(getQueuedProducts)),
    map(([action, products]) => products),
    map(
      products => products
        .map(product => product.file)
        .join(',')
    ),
    map(productsStr => console.log(productsStr))
  );
}
