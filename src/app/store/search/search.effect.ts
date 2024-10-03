import { Injectable } from '@angular/core';
import * as moment from 'moment';

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
import * as searchStore from '@store/search';
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
    private hyp3Service: services.Hyp3Service,
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

  public setCanSearch = createEffect(() => this.actions$.pipe(
    ofType<SetSearchAmount>(SearchActionType.SET_SEARCH_AMOUNT),
    withLatestFrom(this.store$.select(getSearchType)),
    map(([action, _searchType]) =>
      (action.payload > 0 ) ? new EnableSearch() : new DisableSearch()
    )
  ));

  public onUpdateMaturity = createEffect(() => this.actions$.pipe(
    ofType<SetSearchAmount>(SearchActionType.SET_SEARCH_OUT_OF_DATE),
    withLatestFrom(this.searchParams$.getlatestParams),
    map(([_, y]) => y),
    debounceTime(200),
    withLatestFrom(this.store$.select(getSearchType)),
    filter(([_, searchType]) => searchType !== SearchType.SARVIEWS_EVENTS
      && searchType !== SearchType.CUSTOM_PRODUCTS
      && searchType !== SearchType.BASELINE
      && searchType !== SearchType.SBAS),
    map(([params, _]) => ({ ...params, output: 'COUNT' })),
    tap(_ =>
      this.store$.dispatch(new searchStore.SearchAmountLoading())
    ),
    switchMap(params => {
      return this.asfApiService.query<any[]>(params).pipe(
        catchError(resp => {
          const { error } = resp;
          if (!resp.ok || error && error.includes('VALIDATION_ERROR')) {
            return of(0);
          }

          return of(-1);
        })
      );
    }
    ),
    map(searchAmount => {
      const amount = +<number>searchAmount;

      this.store$.dispatch(new searchStore.SetSearchAmount(amount));
    })
  ), { dispatch: false });

  public setEventSearchProductsOnClear = createEffect(() => this.actions$.pipe(
    ofType<ClearScenes>(ScenesActionType.CLEAR),
    withLatestFrom(this.store$.select(getSearchType)),
    switchMap(([_, searchType]) => {
      if (searchType === SearchType.SARVIEWS_EVENTS) {
        return this.sarviewsService.getSarviewsEvents$
      } else {
        return of([])
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
      }
      if (searchType === SearchType.BASELINE || searchType === SearchType.SBAS) {
        return this.asfApiBaselineQuery$();
      }
      if (searchType === SearchType.CUSTOM_PRODUCTS) {
        return this.customProductsQuery$();
      }
      this.logCountries();

      return this.asfApiQuery$;
    }
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
      let output: any[] = [
        new scenesStore.SetScenes({
          products: action.payload.files,
          searchType: action.payload.searchType
        })
      ];
      if (action.payload.totalCount) {
        output.push(new SetSearchAmount(action.payload.totalCount))
      }
      return output
    })
  ));

  public onDemandSearchResponse = createEffect(() => this.actions$.pipe(
    ofType<SearchResponse>(SearchActionType.SEARCH_RESPONSE),
    withLatestFrom(this.store$.select(getSearchType)),
    filter(([_, searchType]) => searchType === SearchType.CUSTOM_PRODUCTS),
    switchMap(([action, _]) =>
      [!!action.payload.next ? new SetNextJobsUrl(action.payload.next) : new SetNextJobsUrl('')]
    )
  ));

  public onLoadOnDemandScenesList = createEffect(() => this.actions$.pipe(
    ofType<LoadOnDemandScenesList>(SearchActionType.LOAD_ON_DEMAND_SCENES_LIST),
    filter(action => action.payload.length !== 0),
    switchMap(action => {
      const products = action.payload;

      const granuleNames = products.reduce((names, prod) => {
        const scenes = prod.metadata.job.job_parameters.scenes;

        if (!!scenes) {
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
    map(results => this.productService.fromResponse(results).
      filter(product => {
        return !product.metadata.productType.includes('METADATA');
      })
    ),
    map(results => {
      return new scenesStore.AddCmrDataToOnDemandScenes(results);
    })
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
              return of(new SearchError(`Unknown Error`));
            }
            return EMPTY;
          }
        ),
      ))
  );

  public asfApiBaselineQuery$(): Observable<Action> {
    this.logCountries();
    return this.searchParams$.getParams.pipe(
      switchMap(
        (params) =>
          this.asfApiService.query<any[]>(params).pipe(
            withLatestFrom(combineLatest([
              this.store$.select(getSearchType),
              this.store$.select(getIsCanceled)]
            )),
            map(([response, [searchType, isCanceled]]) => {
              const files = this.productService.fromResponse(response)
              return !isCanceled ?
                new SearchResponse({
                  files,
                  totalCount: files.length,
                  searchType
                }) :
                new SearchCanceled()
            }
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

  private getAllGranulesFromJobs(jobs: any) {
    return jobs.reduce(
      (granuleNames, job) => {
        return granuleNames.concat(job.job_parameters.granules);
      },
      [])
  }

  private dummyProducts$(granuleNames: string[]) {
    const dummyProducts = granuleNames.map(granuleName => {
      return {
        ...this.dummyProduct(),
        name: granuleName
      };
    })

    return of(dummyProducts);
  }

  private onDemandGranuleList$(jobsRes, latestScenes) {
    const jobs = jobsRes.hyp3Jobs;

    const granuleNames = this.getAllGranulesFromJobs(jobs);
    const fakeApiListQuery = this.dummyProducts$(granuleNames);

    return fakeApiListQuery.pipe(
      map(dummyProducts => {
        return dummyProducts
          .reduce((prodsByName, p) => {
            prodsByName[p.name] = p;
            return prodsByName;
          }, {});
      }),
      map(dummyProducts => {
        return this.hyp3JobToProducts(jobs, dummyProducts);
      }),
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
        _ => {
          return of(new SearchError(`Error loading search results`));
        }
      ),
    );
  }

  private customProductsQuery$(): Observable<Action> {
    return this.searchParams$.getOnDemandSearchParams.pipe(
      switchMap(
        params => {
          return this.hyp3Service.getJobs$(params.userID).pipe(
            switchMap(
              (jobsRes: { hyp3Jobs: models.Hyp3Job[], next: string }) => {
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

  private nextCustomProduct$(next: string, latestScenes: models.CMRProduct[]): Observable<Action> {
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

          return this.onDemandGranuleList$(jobsRes, latestScenes);
        }
      ),
    );
  }

  private sarviewsEventsQuery$() {
    return this.sarviewsService.getSarviewsEvents$.pipe(
      filter(events => !!events),
      map(events => new SarviewsEventsResponse({ events }))
    );
  }

  private hyp3JobToProducts(jobs, products) {
    const virtualProducts = jobs
      .filter(job => products[job.job_parameters.granules[0]])
      .map(job => {
        const product = products[job.job_parameters.granules[0]];
        const jobFile = !!job.files ?
          job.files[0] :
          { size: -1, url: '', filename: product.name };

        const scene_keys = job.job_parameters.granules;
        job.job_parameters.scenes = [];
        for (const scene_key of scene_keys) {
          job.job_parameters.scenes.push(products[scene_key]);
        }

        const jobProduct = {
          ...product,
          browses: job.browse_images ? job.browse_images : ['assets/no-browse.png'],
          thumbnail: job.thumbnail_images ? job.thumbnail_images[0] : 'assets/no-thumb.png',
          productTypeDisplay: `${job.job_type}, ${product.metadata.productType} `,
          downloadUrl: jobFile.url,
          bytes: jobFile.size,
          groupId: job.job_id,
          id: job.job_id,
          isDummyProduct: true,
          metadata: {
            ...product.metadata,
            fileName: jobFile.filename || '',
            productType: job.job_type,
            job
          },
        };

        return jobProduct
      });

    return virtualProducts;
  }

  private dummyProduct() {
    // "2023-11-21T18:03:43+00:00"
    return {
      "name": "",
      "productTypeDisplay": "",
      "file": "",
      "id": "",
      "downloadUrl": "",
      "bytes": 0,
      "dataset": "",
      "browses": [
        "/assets/no-browse.png"
      ],
      "thumbnail": "/assets/no-thumb.png",
      "groupId": "",
      "isUnzippedFile": false,
      "isDummyProduct": true,
      "metadata": {
        "date": moment.utc("1970-01-01T00:00:00+00:00"),
        "stopDate": moment.utc("1970-01-01T00:00:00+00:00"),
        "polygon": "POLYGON ((0 0, 0 0, 0 0, 0 0, 0 0))",
        "productType": "",
        "beamMode": "",
        "polarization": "",
        "flightDirection": "",
        "path": 0,
        "frame": 0,
        "absoluteOrbit": [
          0
        ],
        "faradayRotation": 0,
        "offNadirAngle": 0,
        "instrument": "",
        "pointingAngle": null,
        "missionName": null,
        "flightLine": null,
        "stackSize": null,
        "perpendicular": null,
        "temporal": null,
        "canInSAR": true,
        "job": null,
        "fileName": null,
        "burst": null,
        "opera": null,
        "pgeVersion": 0,
        "subproducts": [],
        "parentID": null
      }
    };
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
