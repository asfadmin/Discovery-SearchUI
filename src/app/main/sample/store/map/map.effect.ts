import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { Observable, of } from 'rxjs';
import { switchMap, map, catchError, tap } from 'rxjs/operators';

import { AppState } from '../app.reducer';
import { MapService } from '../../services';

import * as mapActions from './map.action';


@Injectable()
export class GranulesEffects {
  constructor(
    private mapService: MapService,
    private actions$: Actions
  ) {}

  @Effect({ dispatch: false })
  private setMapCenter: Observable<void> = this.actions$
    .pipe(
      ofType<mapActions.SetMapCenter>(mapActions.MapActionType.SET_MAP_CENTER),
      map(action => this.mapService.setCenter(action.payload))
    );
}
