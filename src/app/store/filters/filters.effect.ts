import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, withLatestFrom } from 'rxjs/operators';

import * as models from '@models';
import { SearchType } from '@models';
import { AppState } from '@store/app.reducer';
import { ResetMaxHyp3ResultsHit } from '@store/hyp3';
import { getSearchType, SearchActionType } from '@store/search';
import { LoadFiltersPreset } from '@store/user';

import * as filtersAction from './filters.action';
import { getSelectedDataset } from './filters.reducer';
import { MapService } from '../../services/map/map.service';

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

  public loadLoadUserProfile = createEffect(() =>
    this.actions$.pipe(
      ofType<filtersAction.SetDefaultFilters>(
        filtersAction.FiltersActionType.SET_DEFAULT_FILTERS,
      ),
      map((action) => action.payload),
      filter((defaultFilters) => !!defaultFilters),
      withLatestFrom(this.store$.select(getSearchType)),
      filter(
        ([_, searchtype]) =>
          searchtype !== SearchType.LIST &&
          searchtype !== SearchType.CUSTOM_PRODUCTS,
      ),
      map(([defaultFilters, searchtype]) => defaultFilters[searchtype]),
      filter((targetFilterID) => targetFilterID === '' || !!targetFilterID),
      map((targetFilterID) => new LoadFiltersPreset(targetFilterID)),
    ),
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
      withLatestFrom(
        this.store$.select(getSelectedDataset),
        this.store$.select(getSearchType),
      ),
      filter(
        ([_, dataset, searchType]) =>
          !!dataset && searchType === SearchType.DATASET,
      ),
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

  public clearDefaultFiltersOnSearchTypeChange = createEffect(() =>
    this.actions$.pipe(
      ofType(SearchActionType.SET_SEARCH_TYPE_AFTER_SAVE),
      withLatestFrom(
        this.store$.select(getSelectedDataset),
        this.store$.select(getSearchType),
      ),
      filter(
        ([_, dataset, searchType]) =>
          searchType !== SearchType.DATASET && !!dataset?.defaultFilters,
      ),
      map(([_, dataset]) => {
        const cleared = Object.fromEntries(
          Object.entries(dataset.defaultFilters).map(([key, value]) => [
            key,
            Array.isArray(value) ? [] : null,
          ]),
        );
        return new filtersAction.ApplyDatasetDefaults(cleared);
      }),
    ),
  );
}
