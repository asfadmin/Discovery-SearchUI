import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Observable } from 'rxjs';
import { map, withLatestFrom, tap } from 'rxjs/operators';

import { AppState } from '../app.reducer';
import * as filtersAction from './filters.action';
import * as filtersReducer from './filters.reducer';
import { MapService } from '@services';

@Injectable()
export class FiltersEffects {

  constructor(
    private store$: Store<AppState>,
    private mapService: MapService,
    private actions$: Actions) {}

  @Effect() updateDateRangeOnPlatformRemoved$: Observable<Action> = this.actions$.pipe(
    ofType<filtersAction.RemoveSelectedPlatform>(filtersAction.FiltersActionType.REMOVE_SELECTED_PLATFORM),
    map(action => new filtersAction.ClearDateRange())
  );

  @Effect({ dispatch: false }) setPolygonStyleWhenOmittingSearchPolygon$: Observable<void> = this.actions$.pipe(
    ofType<filtersAction.OmitSearchPolygon>(filtersAction.FiltersActionType.OMIT_SEARCH_POLYGON),
    map(action => this.mapService.setOmittedPolygon())
  );

  @Effect({ dispatch: false }) setPolygonStyleWhenUsingSearchPolygon: Observable<void> = this.actions$.pipe(
    ofType<filtersAction.UseSearchPolygon>(filtersAction.FiltersActionType.USE_SEARCH_POLYGON),
    map(action => this.mapService.setValidPolygon())
  );
}
