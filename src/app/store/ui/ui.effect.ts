import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Observable } from 'rxjs';
import { map, withLatestFrom, tap, filter } from 'rxjs/operators';

import { AppState } from '../app.reducer';
import * as uiActions from './ui.action';
import * as uiReducer from './ui.reducer';
import * as mapStore from '../map';
import * as granulesStore from '../granules';

import { MapService } from '../../services/map/map.service';
import * as models from '@models';

@Injectable()
export class UIEffects {

  constructor(
    private store$: Store<AppState>,
    private mapService: MapService,
    private actions$: Actions) {}

  @Effect() setMapInteractionModeBasedOnSearchType: Observable<Action> = this.actions$.pipe(
    ofType<uiActions.SetSearchType>(uiActions.UIActionType.SET_SEARCH_TYPE),
    filter(action => action.payload === models.SearchType.DATASET),
    map(_ => new mapStore.SetMapInteractionMode(models.MapInteractionModeType.DRAW))
  );

  @Effect() openFiltersMenuOnSearchTypeChange: Observable<Action> = this.actions$.pipe(
    ofType<uiActions.SetSearchType>(uiActions.UIActionType.SET_SEARCH_TYPE),
    filter(action => action.payload !== models.SearchType.DATASET),
    map(_ => new uiActions.OpenFiltersMenu())
  );

  @Effect() clearResultsWhenSearchTypeChanges: Observable<Action> = this.actions$.pipe(
    ofType<uiActions.SetSearchType>(uiActions.UIActionType.SET_SEARCH_TYPE),
    map(_ => new granulesStore.ClearGranules())
  );
}
