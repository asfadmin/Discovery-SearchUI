import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Observable } from 'rxjs';
import { map, withLatestFrom, tap } from 'rxjs/operators';

import { AppState } from '../app.reducer';
import * as filtersAction from './filters.action';
import * as filtersReducer from './filters.reducer';
import { ClearSelectedMission } from '../mission/mission.action';

import { MapService } from '../../services/map/map.service';
import * as models from '@models';

@Injectable()
export class FiltersEffects {

  constructor(
    private store$: Store<AppState>,
    private mapService: MapService,
    private actions$: Actions,
  ) {}

  @Effect() updateDateRangeOnDatasetRemoved$: Observable<Action> = this.actions$.pipe(
    ofType<filtersAction.SetSelectedDataset>(filtersAction.FiltersActionType.SET_SELECTED_DATASET),
    map(action => new filtersAction.ClearDateRange())
  );

  @Effect() clearMissionWhenDatasetChanges: Observable<Action> = this.actions$.pipe(
    ofType<filtersAction.SetSelectedDataset>(filtersAction.FiltersActionType.SET_SELECTED_DATASET),
    map(action => new ClearSelectedMission())
  );

  @Effect({ dispatch: false }) setPolygonStyleWhenOmittingSearchPolygon$: Observable<void> = this.actions$.pipe(
    ofType<filtersAction.OmitSearchPolygon>(filtersAction.FiltersActionType.OMIT_SEARCH_POLYGON),
    map(
      action => this.mapService.setDrawStyle(models.DrawPolygonStyle.OMITTED)
    )
  );

  @Effect({ dispatch: false }) setPolygonStyleWhenUsingSearchPolygon: Observable<void> = this.actions$.pipe(
    ofType<filtersAction.UseSearchPolygon>(filtersAction.FiltersActionType.USE_SEARCH_POLYGON),
    map(
      action => this.mapService.setDrawStyle(models.DrawPolygonStyle.VALID)
    )
  );
}
