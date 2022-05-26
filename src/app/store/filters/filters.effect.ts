import { Injectable } from '@angular/core';

import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';

import { Observable } from 'rxjs';
import { filter, map, withLatestFrom } from 'rxjs/operators';

import * as filtersAction from './filters.action';

import { MapService } from '../../services/map/map.service';
import * as models from '@models';

import { AppState } from '@store/app.reducer';
import { Store } from '@ngrx/store';

import { getSearchType } from '@store/search';
import { LoadFiltersPreset } from '@store/user';
import { SearchType } from '@models';

@Injectable()
export class FiltersEffects {

  constructor(
    private actions$: Actions,
    private store$: Store<AppState>,
    private mapService: MapService,
  ) {}

  @Effect({ dispatch: false }) setPolygonStyleWhenOmittingSearchPolygon$: Observable<void> = this.actions$.pipe(
    ofType<filtersAction.OmitSearchPolygon>(filtersAction.FiltersActionType.OMIT_SEARCH_POLYGON),
    map(
      _ => this.mapService.setDrawStyle(models.DrawPolygonStyle.OMITTED)
    )
  );

  @Effect({ dispatch: false }) setPolygonStyleWhenUsingSearchPolygon: Observable<void> = this.actions$.pipe(
    ofType<filtersAction.UseSearchPolygon>(filtersAction.FiltersActionType.USE_SEARCH_POLYGON),
    map(
      _ => this.mapService.setDrawStyle(models.DrawPolygonStyle.VALID)
    )
  );

  public loadLoadUserProfile = createEffect(() => this.actions$.pipe(
    ofType<filtersAction.SetDefaultFilters>(filtersAction.FiltersActionType.SET_DEFAULT_FILTERS),
    map(action => action.payload),
    filter(defaultFilters => !!defaultFilters),
    withLatestFrom(this.store$.select(getSearchType)),
    filter(([_, searchtype]) => searchtype !== SearchType.LIST && searchtype !== SearchType.CUSTOM_PRODUCTS
    && searchtype !== SearchType.SARVIEWS_EVENTS),
    map(([defaultFilters, searchtype]) => defaultFilters[searchtype]),
    filter(targetFilterID => targetFilterID === '' || !!targetFilterID),
    map(targetFilterID => new LoadFiltersPreset(targetFilterID))
    )
    );
}
