import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';

import { of, forkJoin, combineLatest, Observable, EMPTY } from 'rxjs';
import { map, withLatestFrom, switchMap, catchError, filter, first, tap, debounceTime } from 'rxjs/operators';

import { AppState } from '../app.reducer';
import {
  SetSearchAmount, EnableSearch, DisableSearch, SetSearchType, SetNextJobsUrl,
  Hyp3BatchResponse, SarviewsEventsResponse, SetSearchOutOfDate
} from './search.action';
import * as scenesStore from '@store/scenes';
import * as filtersStore from '@store/filters';
import * as mapStore from '@store/map';
import * as uiStore from '@store/ui';
import * as hyp3Store from '@store/hyp3';

import * as services from '@services';

import {
  SearchActionType, LoadOnDemandScenesList,
  SearchResponse, SearchError, CancelSearch, SearchCanceled
} from './search.action';
import { getIsCanceled, getareResultsOutOfDate, getSearchType } from './search.reducer';

import * as models from '@models';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import WKT from 'ol/format/WKT';
import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
import { ClearScenes, getAreResultsLoaded, getScenes, ScenesActionType, SetSarviewsEvents } from '@store/scenes';
import { SearchType } from '@models';
import { Feature } from 'ol';
import Geometry from 'ol/geom/Geometry';
import { FiltersActionType } from '@store/filters';
import { getIsFiltersMenuOpen, getIsResultsMenuOpen } from '@store/ui';

@Injectable()
export class SearchEffects {
  private vectorSource = new VectorSource({
    format: new GeoJSON(),
  });

  constructor(
    private actions$: Actions,
    private store$: Store<AppState>,
    private searchParams$: services.SearchParamsService,
    private asfApiService: services.AsfApiService,
    private productService: services.ProductService,
    private hyp3Service: services.Hyp3ApiService,
    private hyp3JobService: services.Hyp3JobService,
    private sarviewsService: services.SarviewsEventsService,
    private http: HttpClient,
    private notificationService: services.NotificationService,
  ) { }

  public clearMapInteractionModeOnSearch = createEffect(() => this.actions$.pipe(
    ofType(SearchActionType.MAKE_SEARCH),
    map(_ => new mapStore.SetMapInteractionMode(models.MapInteractionModeType.NONE))
  ));

  public closeMenusWhenSearchIsMade = createEffect(() => this.actions$.pipe(
    ofType(SearchActionType.MAKE_SEARCH),
    switchMap(_ => [
      new uiStore.ToggleFiltersMenu(),
      new uiStore.CloseFiltersMenu(),
      new uiStore.CloseAOIOptions()
    ])
  ));

  public resetMoreJobsToLoadOnSearch = createEffect(() => this.actions$.pipe(
    ofType(SearchActionType.MAKE_SEARCH),
    switchMap(_ => [
      new hyp3Store.ResetMaxHyp3ResultsHit(),
    ])
  ));

  public setCanSearch = createEffect(() => this.actions$.pipe(
    ofType<SetSearchAmount>(SearchActionType.SET_SEARCH_AMOUNT),
    withLatestFrom(this.store$.select(getSearchType)),
    map(([action, _searchType]) =>
      (action.payload > 0) ? new EnableSearch() : new DisableSearch()
    )
  ));

  public setEventSearchProductsOnClear = createEffect(() => this.actions$.pipe(
    ofType<ClearScenes>(ScenesActionType.CLEAR),
    withLatestFrom(this.store$.select(getSearchType)),
    switchMap(([_, searchType]) => {
      if (searchType === SearchType.SARVIEWS_EVENTS) {
        return this.sarviewsService.getSarviewsEvents$;
      } else {
        return of([]);
      }
    }),
    map((events) => new SetSarviewsEvents({ events }))
  )
  );

  public makeSearches = createEffect(() => this.actions$.pipe(
    ofType(SearchActionType.MAKE_SEARCH),
    withLatestFrom(this.store$.select(getSearchType)),
    switchMap(([_, searchType]) => {
      if (searchType === SearchType.SARVIEWS_EVENTS) {
        return this.sarviewsEventsQuery$();
      } else if (searchType === SearchType.BASELINE || searchType === SearchType.SBAS) {
        this.logCountries();
        return this.asfApiBaselineQuery$();
      } else if (searchType === SearchType.CUSTOM_PRODUCTS) {
        return this.customProductsQuery$();
      } else {
        this.logCountries();
        return this.asfApiQuery$;
      }
    }
    )
  ));

  public getNextJobBatch = createEffect(() => this.actions$.pipe(
    ofType<SetNextJobsUrl>(SearchActionType.SET_NEXT_JOBS_URL),
    withLatestFrom(combineLatest([
      this.store$.select(getScenes),
      this.store$.select(hyp3Store.getMaxHyp3Jobs),
    ])),
    filter(([action, [scenes, _]]) => {
      return !!action.payload && scenes !== undefined;
    }),
    switchMap(
      ([action, [scenes, maxHyp3Jobs]]) => {
        const next = action.payload;

        if (scenes.length > maxHyp3Jobs) {
          return of(new hyp3Store.MaxHyp3ResultsHit());
        }

        return this.hyp3Service.getJobsByUrl$(next).pipe(
          switchMap(
            (jobsRes) => {
              if (jobsRes.hyp3Jobs.length === 0) {
                return of(new Hyp3BatchResponse({
                  files: [],
                  totalCount: 0,
                  searchType: models.SearchType.CUSTOM_PRODUCTS,
                  next: ''
                }));
              }

              return this.onDemandGranuleList$(jobsRes, scenes);
            }
          ),
        );
      }
    )
  ));

  public cancelSearchWhenFiltersCleared = createEffect(() => this.actions$.pipe(
    ofType(
      filtersStore.FiltersActionType.CLEAR_DATASET_FILTERS,
      filtersStore.FiltersActionType.CLEAR_LIST_FILTERS,
      filtersStore.FiltersActionType.CLEAR_TEMPORAL_RANGE,
      filtersStore.FiltersActionType.CLEAR_PERPENDICULAR_RANGE,
      scenesStore.ScenesActionType.CLEAR_BASELINE,
    ),
    map(_ => new CancelSearch())
  ));

  public cancelSearchonOnPanelOpen = createEffect(() => this.actions$.pipe(
    ofType(uiStore.UIActionType.OPEN_FILTERS_MENU),
    switchMap(_ => [
      new filtersStore.StoreCurrentFilters(),
      new CancelSearch()
    ])
  ));

  public searchResponse = createEffect(() => this.actions$.pipe(
    ofType<SearchResponse>(SearchActionType.SEARCH_RESPONSE),
    switchMap(action => {
      const output: any[] = [
        new scenesStore.SetScenes({
          products: action.payload.files,
          searchType: action.payload.searchType
        })
      ];
      if (action.payload.totalCount) {
        output.push(new SetSearchAmount(action.payload.totalCount));
      }
      return output;
    })
  ));

  public onDemandSearchResponse = createEffect(() => this.actions$.pipe(
    ofType<SearchResponse>(SearchActionType.SEARCH_RESPONSE),
    withLatestFrom(this.store$.select(getSearchType)),
    filter(([_, searchType]) => searchType === SearchType.CUSTOM_PRODUCTS),
    switchMap(([action, _]) => {
      if (action.payload.next) {
        return [new SetNextJobsUrl(action.payload.next)];
      } else {
        return [new SetNextJobsUrl('')];
      }
    }
    )
  ));

  public onLoadOnDemandScenesList = createEffect(() => this.actions$.pipe(
    ofType<LoadOnDemandScenesList>(SearchActionType.LOAD_ON_DEMAND_SCENES_LIST),
    filter(action => action.payload.length !== 0),
    switchMap(action => {
      const products = action.payload;

      const granuleNames = products.reduce((names, prod) => {
        const scenes = prod.metadata.job.scenes;

        if (scenes) {
          const gNames = scenes
            .filter(g => !!g && 'name' in g)
            .map(g => g.name);

          return names.concat(gNames);
        } else {
          return names.push(prod.name);
        }
      }, []);

      const params = { 'granule_list': (<any>granuleNames).join(',') };

      return this.asfApiService.query(params);
    }),
    withLatestFrom(this.store$.select(scenesStore.getProducts)),
    map(([asfApiResp, products]) => {
      const results = this.productService.fromResponse(asfApiResp)
        .filter(product => !product.metadata.productType.includes('METADATA'));

      const cmrData = results.reduce((prods, product) => {
        prods[product.name] = product;
        return prods;
      }, {});

      const combinedProducts = this.hyp3JobService.combineWithCmrProduct(products, cmrData);

      return new scenesStore.AddCmrDataToOnDemandScenes(combinedProducts);
    }),
  ));

  public hyp3BatchResponse = createEffect(() => this.actions$.pipe(
    ofType<Hyp3BatchResponse>(SearchActionType.HYP3_BATCH_RESPONSE),
    switchMap(action => [
      new scenesStore.SetScenes({
        products: action.payload.files,
        searchType: action.payload.searchType
      }),
      action.payload.next ? new SetNextJobsUrl(action.payload.next) : new SetNextJobsUrl(''),
    ]
    )
  ));

  public sarviewsSearchResponse = createEffect(() => this.actions$.pipe(
    ofType<SarviewsEventsResponse>(SearchActionType.SARVIEWS_SEARCH_RESPONSE),
    withLatestFrom(this.store$.select(getSearchType)),
    filter(([_, searchType]) => searchType === SearchType.SARVIEWS_EVENTS),
    switchMap(([action, _]) => [
      new scenesStore.SetSarviewsEvents({
        events: action.payload.events
      }),
      new SetSearchAmount(action.payload.events.length)
    ])
  ));

  public showResultsMenuOnSearchResponse = createEffect(() => this.actions$.pipe(
    ofType<SearchResponse>(SearchActionType.SEARCH_RESPONSE),
    map(_ => new uiStore.OpenResultsMenu()),
  ));

  public showSarviewsEventResultsMenuOnSearchResponse = createEffect(() => this.actions$.pipe(
    ofType<SarviewsEventsResponse>(SearchActionType.SARVIEWS_SEARCH_RESPONSE),
    map(_ => new uiStore.OpenResultsMenu()),
  ));

  public setMapInteractionModeBasedOnSearchType = createEffect(() => this.actions$.pipe(
    ofType<SetSearchType>(SearchActionType.SET_SEARCH_TYPE_AFTER_SAVE),
    filter(action => action.payload === models.SearchType.DATASET),
    map(_ => new mapStore.SetMapInteractionMode(models.MapInteractionModeType.DRAW))
  ));

  public clearResultsWhenSearchTypeChanges = createEffect(() => this.actions$.pipe(
    ofType<SetSearchType>(SearchActionType.SET_SEARCH_TYPE_AFTER_SAVE),
    switchMap(action => [
      new scenesStore.ClearScenes(),
      new uiStore.CloseAOIOptions(),
      action.payload === models.SearchType.LIST ||
        action.payload === models.SearchType.SBAS ||
        action.payload === models.SearchType.BASELINE ||
        action.payload === models.SearchType.DERIVED_DATASETS ?
        new uiStore.OpenFiltersMenu() :
        new uiStore.CloseFiltersMenu(),
      new SetSearchOutOfDate(false)
    ]),
    catchError(
      _ => of(new SearchError('Error loading search results'))
    )
  ));

  public onChangeFiltersHeader = createEffect(() => this.actions$.pipe(
    ofType(
      FiltersActionType.SET_START_DATE,
      FiltersActionType.SET_END_DATE,
      FiltersActionType.SET_SELECTED_DATASET,
      ScenesActionType.SET_MASTER,
      ScenesActionType.SET_FILTER_MASTER,
    ),
    withLatestFrom(this.store$.select(getIsFiltersMenuOpen)),
    withLatestFrom(this.store$.select(getIsResultsMenuOpen)),
    map(([[_, filtersOpen], resultsOpen]) => !filtersOpen && resultsOpen),
    filter(shouldNotify => shouldNotify),
    withLatestFrom(this.store$.select(getSearchType)),
    withLatestFrom(this.store$.select(getareResultsOutOfDate)),
    withLatestFrom(this.store$.select(getAreResultsLoaded)),
    filter(([[[_, searchtype], outOfdate], loaded]) => !outOfdate && searchtype === models.SearchType.DATASET && loaded),
  ).pipe(
    map(_ => new SetSearchOutOfDate(true))
  ));

  public setSearchUpToDate = createEffect(() => this.actions$.pipe(
    ofType(SearchActionType.MAKE_SEARCH,
      SearchActionType.SET_SEARCH_TYPE,
      SearchActionType.SET_SEARCH_TYPE_AFTER_SAVE),
    map(_ => new SetSearchOutOfDate(false))
  ));

  public onSetSearchOutOfDate = createEffect(() => this.actions$.pipe(
    ofType<SetSearchOutOfDate>(SearchActionType.SET_SEARCH_OUT_OF_DATE),
    filter(action => action.payload),
    tap(_ => this.notificationService.info('Refresh search to show new results', 'Results Out of Date'))
  ), { dispatch: false });

  private asfApiQuery$ = this.searchParams$.getParams.pipe(
    debounceTime(100),
    map(params => [params]),
    switchMap(
      ([params]) => forkJoin(
        this.asfApiService.query<any[]>(params)
      ).pipe(
        withLatestFrom(combineLatest([
          this.store$.select(getSearchType),
          this.store$.select(getIsCanceled)]
        )),
        map(([[response], [searchType, isCanceled]]) =>
          !isCanceled ?
            new SearchResponse({
              files: this.productService.fromResponse(response),
              searchType
            }) :
            new SearchCanceled()
        ),
        catchError(
          (err: HttpErrorResponse) => {
            if (err.status !== 400) {
              return of(new SearchError('Unknown Error'));
            }
            return EMPTY;
          }
        ),
      ))
  );

  public asfApiBaselineQuery$(): Observable<Action> {

    return this.searchParams$.getParams.pipe(
      switchMap(
        (params) => {

          const apiQuery$ = this.asfApiService.query<any[]>(params).pipe(
            map(response => this.productService.fromResponse(response))
          );

          return apiQuery$.pipe(
            withLatestFrom(combineLatest([
              this.store$.select(getSearchType),
              this.store$.select(getIsCanceled)]
            )),
            map(([files, [searchType, isCanceled]]) => {

              return !isCanceled ?
                new SearchResponse({
                  files,
                  totalCount: files.length,
                  searchType
                }) :
                new SearchCanceled();
            }
            ),
            catchError(
              (err: HttpErrorResponse) => {
                if (err.status !== 400) {
                  return of(new SearchError('Unknown Error'));
                }
                return EMPTY;
              }
            ),
          );
        })
    );
  }

  private onDemandGranuleList$(
    jobsRes: { hyp3Jobs: models.Hyp3Job[]; next: string },
    latestScenes: models.CMRProduct[]
  ) {
    const jobs = jobsRes.hyp3Jobs;
    const dummyProducts = this.hyp3JobService.toDummyCMRProducts(jobs);

    return of(dummyProducts).pipe(
      withLatestFrom(this.store$.select(getIsCanceled)),
      map(([products, isCanceled]) =>
        !isCanceled ?
          new SearchResponse({
            files: latestScenes.concat(products),
            totalCount: +products.length,
            searchType: models.SearchType.CUSTOM_PRODUCTS,
            next: jobsRes.next
          }) :
          new SearchCanceled()
      ),
      catchError(
        error => {
          console.log(error);
          return of(new SearchError('Error loading search results'));
        }
      ),
    );
  }

  private customProductsQuery$(): Observable<Action> {
    return this.searchParams$.getOnDemandSearchParams.pipe(
      switchMap(
        params => {
          let hyp3Query: Observable<{ hyp3Jobs: models.Hyp3Job[]; next: string }>;

          if (params.jobId) {
            hyp3Query = this.hyp3Service.getJobById$(params.jobId);
          } else {
            hyp3Query = this.hyp3Service.getJobs$({ userID: params.userID });
          }

          return hyp3Query.pipe(
            switchMap(
              (jobsRes: { hyp3Jobs: models.Hyp3Job[]; next: string }) => {
                if (jobsRes.hyp3Jobs.length === 0) {
                  return of(new SearchResponse({
                    files: [],
                    totalCount: 0,
                    searchType: models.SearchType.CUSTOM_PRODUCTS
                  }));
                }

                return this.onDemandGranuleList$(jobsRes, []);
              }
            ),
          );
        }
      )
    );
  }

  private sarviewsEventsQuery$() {
    return this.sarviewsService.getSarviewsEvents$.pipe(
      filter(events => !!events),
      map(events => new SarviewsEventsResponse({ events }))
    );
  }

  private findCountries(shapeString: string) {
    const parser = new WKT();
    const feature = parser.readFeature(shapeString);
    let countries = [];
    this.vectorSource.forEachFeature(f => {
      if (f.getGeometry().intersectsExtent(feature.getGeometry().getExtent())) {
        countries.push(f);
      }
    });
    countries = countries.map(c => c.values_.name);
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'search-countries',
      'search-countries': countries
    });
  }

  private logCountries(): void {
    this.searchParams$.getParams.pipe(first()).subscribe(params => {
      if (params.intersectsWith) {
        if (this.vectorSource.getFeatures().length > 0) {
          this.findCountries(params.intersectsWith);
        } else {
          this.http.get('/assets/countries.geojson').subscribe(f => {
            this.vectorSource.addFeatures(
              this.vectorSource.getFormat().readFeatures(f) as Feature<Geometry>[]
            );
            this.findCountries(params.intersectsWith);
          });
        }
      }
    });
  }
}
