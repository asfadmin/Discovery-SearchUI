import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';

import { of, forkJoin, combineLatest, Observable } from 'rxjs';
import { map, withLatestFrom, switchMap, catchError, filter } from 'rxjs/operators';

import { AppState } from '../app.reducer';
import { SetSearchAmount, EnableSearch, DisableSearch, SetSearchType } from './search.action';
import * as scenesStore from '@store/scenes';
import * as filtersStore from '@store/filters';
import * as mapStore from '@store/map';
import * as uiStore from '@store/ui';

import * as services from '@services';

import {
  SearchActionType,
  SearchResponse, SearchError, CancelSearch, SearchCanceled
} from './search.action';
import { getIsCanceled, getSearchType } from './search.reducer';

import * as models from '@models';

@Injectable()
export class SearchEffects {
  constructor(
    private actions$: Actions,
    private store$: Store<AppState>,
    private searchParams$: services.SearchParamsService,
    private asfApiService: services.AsfApiService,
    private productService: services.ProductService,
    private hyp3Service: services.Hyp3Service,
  ) {}

  public clearMapInteractionModeOnSearch = createEffect(() => this.actions$.pipe(
    ofType(SearchActionType.MAKE_SEARCH),
    map(_ => new mapStore.SetMapInteractionMode(models.MapInteractionModeType.NONE))
  ));

  public closeMenusWhenSearchIsMade = createEffect(() => this.actions$.pipe(
    ofType(SearchActionType.MAKE_SEARCH),
    switchMap(_ => [
      new uiStore.CloseFiltersMenu(),
      new uiStore.CloseAOIOptions()
    ])
  ));

  public setCanSearch = createEffect(() => this.actions$.pipe(
    ofType<SetSearchAmount>(SearchActionType.SET_SEARCH_AMOUNT),
    map(action =>
      (action.payload > 0) ? new EnableSearch() : new DisableSearch()
    )
  ));

  public makeSearches = createEffect(() => this.actions$.pipe(
    ofType(SearchActionType.MAKE_SEARCH),
    withLatestFrom(this.store$.select(getSearchType)),
    switchMap(([_, searchType]) => searchType !== models.SearchType.CUSTOM_PRODUCTS ?
      this.asfApiQuery$() :
      this.customProductsQuery$()
    )
  ));

  public cancelSearchWhenFiltersCleared = createEffect(() => this.actions$.pipe(
    ofType(
      filtersStore.FiltersActionType.CLEAR_DATASET_FILTERS,
      filtersStore.FiltersActionType.CLEAR_LIST_FILTERS,
      filtersStore.FiltersActionType.CLEAR_SELECTED_MISSION,
      filtersStore.FiltersActionType.CLEAR_TEMPORAL_RANGE,
      filtersStore.FiltersActionType.CLEAR_PERPENDICULAR_RANGE,
      scenesStore.ScenesActionType.CLEAR_BASELINE,
    ),
    map(_ => new CancelSearch())
  ));

  public searchResponse = createEffect(() => this.actions$.pipe(
    ofType<SearchResponse>(SearchActionType.SEARCH_RESPONSE),
    switchMap(action => [
      new scenesStore.SetScenes({
        products: action.payload.files,
        searchType: action.payload.searchType
      }),
      new SetSearchAmount(action.payload.totalCount)
    ])
  ));

  public hideFilterMenuOnSearchResponse = createEffect(() => this.actions$.pipe(
    ofType<SearchResponse>(SearchActionType.SEARCH_RESPONSE),
    map(_ => new uiStore.CloseFiltersMenu()),
  ));

  public showResultsMenuOnSearchResponse = createEffect(() => this.actions$.pipe(
    ofType<SearchResponse>(SearchActionType.SEARCH_RESPONSE),
    map(_ => new uiStore.OpenResultsMenu()),
  ));

  public setMapInteractionModeBasedOnSearchType = createEffect(() => this.actions$.pipe(
    ofType<SetSearchType>(SearchActionType.SET_SEARCH_TYPE),
    filter(action => action.payload === models.SearchType.DATASET),
    map(_ => new mapStore.SetMapInteractionMode(models.MapInteractionModeType.DRAW))
  ));

  public clearResultsWhenSearchTypeChanges = createEffect(() => this.actions$.pipe(
    ofType<SetSearchType>(SearchActionType.SET_SEARCH_TYPE),
    switchMap(action => [
      new scenesStore.ClearScenes(),
      new uiStore.CloseAOIOptions(),
      action.payload === models.SearchType.LIST ?
        new uiStore.OpenFiltersMenu() :
        new uiStore.CloseFiltersMenu(),
    ]),
    catchError(
      _ => of(new SearchError(`Error loading search results`))
    )
  ));

  private asfApiQuery$(): Observable<Action> {
    return this.searchParams$.getParams().pipe(
    map(params => [params, {...params, output: 'COUNT'}]),
    switchMap(
      ([params, countParams]) => forkJoin(
        this.asfApiService.query<any[]>(params),
        this.asfApiService.query<any[]>(countParams)
      ).pipe(
        withLatestFrom(combineLatest(
          this.store$.select(getSearchType),
          this.store$.select(getIsCanceled)
        )),
        map(([[response, totalCount], [searchType, isCanceled]]) =>
          !isCanceled ?
            new SearchResponse({
              files: this.productService.fromResponse(response),
              totalCount: +totalCount,
              searchType
            }) :
            new SearchCanceled()
        ),
      ))
    );
  }

  private customProductsQuery$(): Observable<Action> {
    return this.hyp3Service.getJobs$().pipe(
      switchMap(
        (jobs: models.Hyp3Job[]) => {
          const granules = jobs.map(
            job => job.job_parameters.granules[0]
          ).join(',');

          return this.asfApiService.query<any[]>({ 'granule_list': granules }).pipe(
            map(results => this.productService.fromResponse(results)
              .filter(product => !product.metadata.productType.includes('METADATA'))
              .reduce((products, product) => {
                products[product.name] = product;
                return products;
              } , {})
            ),
            map(products => this.hyp3JobToProducts(jobs, products)),
            withLatestFrom(this.store$.select(getIsCanceled)),
            map(([products, isCanceled]) =>
              !isCanceled ?
                new SearchResponse({
                  files: products.reverse(),
                  totalCount: +products.length,
                  searchType: models.SearchType.CUSTOM_PRODUCTS
                }) :
                new SearchCanceled()
            ),
            catchError(
              _ => {
                console.log(_);
                return of(new SearchError(`Error loading search results`));
              }
            ),
          );
        }
      ),
    );
  }

  private hyp3JobToProducts(jobs, products) {
    const virtualProducts = jobs
      .map(job => {
        const product = products[job.job_parameters.granules[0]];
        const jobFile = !!job.files ?
          job.files[0] :
          {size: -1, url: '', filename: product.name};

        return {
          ...product,
          browses: job.browse_images ? job.browse_images : ['assets/no-browse.png'],
          thumbnail: job.thumbnail_images ? job.thumbnail_images[0] : 'assets/no-thumb.png',
          productTypeDisplay: `${job.job_type.replace('_', ' ') } ${product.metadata.productType} `,
          downloadUrl: jobFile.url,
          bytes: jobFile.size,
          groupId: job.job_id,
          id: job.job_id,
          metadata: {
            ...product.metadata,
            fileName: jobFile.filename,
            productType: job.job_type,
            job
          },
        };
      });

    return virtualProducts;
  }
}
