import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';

import { of, forkJoin, combineLatest, Observable, EMPTY } from 'rxjs';
import { map, withLatestFrom, switchMap, catchError, filter, first, tap } from 'rxjs/operators';

import { AppState } from '../app.reducer';
import { SetSearchAmount, EnableSearch, DisableSearch, SetSearchType, SetNextJobsUrl,
  Hyp3BatchResponse, SarviewsEventsResponse, SetSearchOutOfDate } from './search.action';
import * as scenesStore from '@store/scenes';
import * as filtersStore from '@store/filters';
import * as mapStore from '@store/map';
import * as uiStore from '@store/ui';

import * as services from '@services';

import {
  SearchActionType,
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

  private on_demand_prod_collections = ['C1214471197-ASF','C1214470533-ASF','C1214471521-ASF','C1214472978-ASF','C1214470682-ASF','C1214472994-ASF','C1214470488-ASF','C1327985697-ASF','C1327985645-ASF','C1327985660-ASF','C1327985644-ASF','C1327985571-ASF','C1327985740-ASF','C1327985661-ASF','C1661710578-ASF','C1661710581-ASF','C1661710583-ASF','C1661710590-ASF','C1661710593-ASF','C1661710596-ASF','C1661710597-ASF','C1661710604-ASF','C1214335471-ASF','C1214336154-ASF','C1214337770-ASF','C1214354144-ASF','C1214354235-ASF']
  private on_demand_test_collections = ['C1212200781-ASF','C1212201032-ASF','C1212209035-ASF','C1212158327-ASF','C1212158318-ASF','C1205428742-ASF','C1216244597-ASF','C1216244589-ASF','C1216244594-ASF','C1216244588-ASF','C1216244586-ASF','C1216244600-ASF','C1216244348-ASF','C1226557819-ASF','C1226557809-ASF','C1226557808-ASF','C1226557812-ASF','C1226557813-ASF','C1226557814-ASF','C1226557815-ASF','C1226557818-ASF','C1206132445-ASF','C1212005594-ASF','C1207188317-ASF','C1210546638-ASF','C1206122195-ASF']
  private on_demand_test_collections_asfdev = ['C1245830954-ASFDEV','C1245830954-ASFDEV','C1234413228-ASFDEV','C1234413229-ASFDEV','C1234413230-ASFDEV','C1234413239-ASFDEV','C1234413240-ASFDEV','C1234413241-ASFDEV','C1234413245-ASFDEV','C1234413246-ASFDEV','C1234413247-ASFDEV','C1234413248-ASFDEV','C1234413257-ASFDEV','C1234413258-ASFDEV','C1234413259-ASFDEV','C1234413263-ASFDEV','C1234413264-ASFDEV','C1234413265-ASFDEV','C1234413266-ASFDEV','C1234413269-ASFDEV','C1234413270-ASFDEV','C1234413271-ASFDEV','C1234413272-ASFDEV','C1234413275-ASFDEV']
  constructor(
    private actions$: Actions,
    private store$: Store<AppState>,
    private searchParams$: services.SearchParamsService,
    private asfApiService: services.AsfApiService,
    private productService: services.ProductService,
    private hyp3Service: services.Hyp3Service,
    private sarviewsService: services.SarviewsEventsService,
    private http: HttpClient,
    private notificationService: services.NotificationService,
    // private environmentService: services.EnvironmentService,
  ) {}

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

  public setCanSearch = createEffect(() => this.actions$.pipe(
    ofType<SetSearchAmount>(SearchActionType.SET_SEARCH_AMOUNT),
    map(action =>
      (action.payload > 0) ? new EnableSearch() : new DisableSearch()
    )
  ));

  public setEventSearchProductsOnClear = createEffect(() => this.actions$.pipe(
    ofType<ClearScenes>(ScenesActionType.CLEAR),
    withLatestFrom(this.store$.select(getSearchType)),
    filter(([_, searchtype]) => searchtype === models.SearchType.SARVIEWS_EVENTS),
    withLatestFrom(this.sarviewsService.getSarviewsEvents$()),
    map(([[_, __], events]) => new SetSarviewsEvents({ events }))
  ));

  public makeSearches = createEffect(() => this.actions$.pipe(
    ofType(SearchActionType.MAKE_SEARCH),
    withLatestFrom(this.store$.select(getSearchType)),
    switchMap(([_, searchType]) => searchType !== models.SearchType.CUSTOM_PRODUCTS ?
      (searchType === models.SearchType.SARVIEWS_EVENTS ? this.sarviewsEventsQuery$() : this.asfApiQuery$()) :
      this.customProductsQuery$()
    )
  ));

  public getNextJobBatch = createEffect(() => this.actions$.pipe(
    ofType<SetNextJobsUrl>(SearchActionType.SET_NEXT_JOBS_URL),
    withLatestFrom(this.store$.select(getScenes)),
    filter(([action, scenes]) => !!action.payload && scenes !== undefined),
    switchMap(([action, currentScenes]) => this.nextCustomProduct$(action.payload, currentScenes))
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

    cancelSearchonOnPanelOpen = createEffect(() => this.actions$.pipe(
      ofType(uiStore.UIActionType.OPEN_FILTERS_MENU),
      switchMap(_ => [
        new filtersStore.StoreCurrentFilters(),
        new CancelSearch()
      ])
    )
  );

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

  public onDemandSearchResponse = createEffect(() => this.actions$.pipe(
      ofType<SearchResponse>(SearchActionType.SEARCH_RESPONSE),
      withLatestFrom(this.store$.select(getSearchType)),
      filter(([_, searchType]) => searchType === SearchType.CUSTOM_PRODUCTS),
      switchMap(([action, _]) =>
        [!!action.payload.next ? new SetNextJobsUrl(action.payload.next) : new SetNextJobsUrl('')]
      )
    ));

  public hyp3BatchResponse = createEffect(() => this.actions$.pipe(
    ofType<Hyp3BatchResponse>(SearchActionType.HYP3_BATCH_RESPONSE),
    switchMap(action => [
      new scenesStore.SetScenes({
        products: action.payload.files,
        searchType: action.payload.searchType
      }),
      !!action.payload.next ? new SetNextJobsUrl(action.payload.next) : new SetNextJobsUrl(''),
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
      _ => of(new SearchError(`Error loading search results`))
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
  ), {dispatch: false});

  private asfApiQuery$(): Observable<Action> {
    this.logCountries();
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
        catchError(
          (err: HttpErrorResponse) => {
            if (err.status !== 400) {
              return of(new SearchError(`Unknown Error`));
            }
            return EMPTY;
          }
        ),
      ))
    );
  }

  private customProductsQuery$(): Observable<Action> {
    return this.hyp3Service.getJobs$().pipe(
      switchMap(
        (jobsRes: {hyp3Jobs: models.Hyp3Job[], next: string}) => {
          const jobs = jobsRes.hyp3Jobs;
          if (jobs.length === 0) {
            return of(new SearchResponse({
              files: [],
              totalCount: 0,
              searchType: models.SearchType.CUSTOM_PRODUCTS
            }));
          }

          const granules = jobs.map(
            job => {
              return job.job_parameters.granules.join(',');
            }
          ).join(',');

          let collections: String[] = []

          // In case we wanted to limit searched collections further, limit it based on envionment
          // let provider = this.environmentService.currentEnv.cmr_provider
          // let maturity = this.environmentService.maturity

          // if (maturity === 'prod') {
          collections = this.on_demand_prod_collections

          // } else if(provider === 'ASF') {
          collections.push(...this.on_demand_test_collections)

          // } else {
          collections.push(...this.on_demand_test_collections_asfdev)

          // }

          return this.asfApiService.query<any[]>({ 'granule_list': granules, 'collections': collections.join(',') }).pipe(
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
                  files: products,
                  totalCount: +products.length,
                  searchType: models.SearchType.CUSTOM_PRODUCTS,
                  next: jobsRes.next
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

  private nextCustomProduct$(next: string, latestScenes: models.CMRProduct[]): Observable<Action> {
    return this.hyp3Service.getJobsByUrl$(next).pipe(
      switchMap(
        (jobsRes) => {
          const jobs = jobsRes.hyp3Jobs;
          if (jobs.length === 0) {
            return of(new Hyp3BatchResponse({
              files: [],
              totalCount: 0,
              searchType: models.SearchType.CUSTOM_PRODUCTS,
              next: ''
            }));
          }

          const granules = jobs.map(
            job => {
              return job.job_parameters.granules.join(',');
            }
          ).join(',');

          let collections: String[] = []

          // In case we wanted to limit searched collections further, limit it based on envionment
          // let provider = this.environmentService.currentEnv.cmr_provider
          // let maturity = this.environmentService.maturity

          // if (maturity === 'prod') {
          collections = this.on_demand_prod_collections

          // } else if(provider === 'ASF') {
          collections.push(...this.on_demand_test_collections)

          // } else {
          collections.push(...this.on_demand_test_collections_asfdev)

          // }

          return this.asfApiService.query<any[]>({ 'granule_list': granules, 'collections': collections.join(',') }).pipe(
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
                new Hyp3BatchResponse({
                  files: latestScenes.concat(products),
                  totalCount: +products.length,
                  searchType: models.SearchType.CUSTOM_PRODUCTS,
                  next: jobsRes.next
                }) :
                new SearchCanceled()
            ),
            catchError(
              _ => {
                console.log(_);
                return of(new SearchError(`Error loading next batch of On Demand results`));
              }
            ),
          );
        }
      ),
    );
  }

  private sarviewsEventsQuery$() {
    return this.sarviewsService.getSarviewsEvents$().pipe(
      filter(events => !!events),
      map(events => new SarviewsEventsResponse({events }))
    );
  }

  private hyp3JobToProducts(jobs, products) {
    const virtualProducts = jobs
      .filter(job => products[job.job_parameters.granules[0]])
      .map(job => {
        const product = products[job.job_parameters.granules[0]];
        const jobFile = !!job.files ?
          job.files[0] :
          {size: -1, url: '', filename: product.name};

        const scene_keys = job.job_parameters.granules;
        job.job_parameters.scenes = [];
        for (const scene_key of scene_keys) {
          job.job_parameters.scenes.push(products[scene_key]);
        }

        return {
          ...product,
          browses: job.browse_images ? job.browse_images : ['assets/no-browse.png'],
          thumbnail: job.thumbnail_images ? job.thumbnail_images[0] : 'assets/no-thumb.png',
          productTypeDisplay: `${job.job_type}, ${product.metadata.productType} `,
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
    this.searchParams$.getParams().pipe(first()).subscribe(params => {
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
