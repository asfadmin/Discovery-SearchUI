import { Injectable, inject } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { Observable } from 'rxjs';
import { filter, map, withLatestFrom } from 'rxjs/operators';

import * as filtersAction from './filters.action';

import { MapService } from '../../services/map/map.service';
import * as models from '@models';

import { AppState } from '@store/app.reducer';
import { Store } from '@ngrx/store';

import { ResetMaxHyp3ResultsHit } from '@store/hyp3';
import { getSelectedDataset } from './filters.reducer';

@Injectable()
export class FiltersEffects {
  private actions$ = inject(Actions);
  private store$ = inject<Store<AppState>>(Store);
  private mapService = inject(MapService);

  setPolygonStyleWhenOmittingSearchPolygon$: Observable<void> = createEffect(
    () =>
      this.actions$.pipe(
        ofType<filtersAction.OmitSearchPolygon>(
          filtersAction.FiltersActionType.OMIT_SEARCH_POLYGON,
        ),
        map((_) =>
          this.mapService.setDrawStyle(models.DrawPolygonStyle.OMITTED),
        ),
      ),
    { dispatch: false },
  );

  setPolygonStyleWhenUsingSearchPolygon: Observable<void> = createEffect(
    () =>
      this.actions$.pipe(
        ofType<filtersAction.UseSearchPolygon>(
          filtersAction.FiltersActionType.USE_SEARCH_POLYGON,
        ),
        map((_) => this.mapService.setDrawStyle(models.DrawPolygonStyle.VALID)),
      ),
    { dispatch: false },
  );

  public resetMoreHyp3JobsToLoad = createEffect(() =>
    this.actions$.pipe(
      ofType<filtersAction.SetProjectName>(
        filtersAction.FiltersActionType.SET_PROJECT_NAME,
      ),
      map((_) => new ResetMaxHyp3ResultsHit()),
    ),
  );

  public applyDefaultFilters = createEffect(() =>
    this.actions$.pipe(
      ofType(
        filtersAction.FiltersActionType.CLEAR_DATASET_FILTERS,
        filtersAction.FiltersActionType.SET_SELECTED_DATASET,
      ),
      withLatestFrom(this.store$.select(getSelectedDataset)),
      filter(([_, dataset]) => !!dataset),
      map(([_, dataset]) => {
        const defaults = dataset.defaultFilters;
        if (!defaults) {
          return null;
        }

        return new filtersAction.ApplyDatasetDefaults(defaults);
      }),
      filter((a) => a !== null),
    ),
  );
}
