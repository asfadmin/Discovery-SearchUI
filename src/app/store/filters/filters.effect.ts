import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppState } from '../app.reducer';
import * as filtersAction from './filters.action';

import { MapService } from '../../services/map/map.service';
import * as models from '@models';

@Injectable()
export class FiltersEffects {

  constructor(
    private store$: Store<AppState>,
    private actions$: Actions,
    private mapService: MapService,
  ) {}

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
