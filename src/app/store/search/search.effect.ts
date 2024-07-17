import { Injectable } from '@angular/core';
import * as moment from 'moment';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';

import { of, forkJoin, combineLatest, Observable, EMPTY } from 'rxjs';
import { map, withLatestFrom, switchMap, catchError, filter, first, tap, debounceTime } from 'rxjs/operators';

import { AppState } from '../app.reducer';
import {
  SetSearchAmount, EnableSearch, DisableSearch, SetSearchType, SetNextJobsUrl,
  Hyp3BatchResponse, SarviewsEventsResponse, SetSearchOutOfDate,
  TimeseriesSearchResponse
} from './search.action';
import * as scenesStore from '@store/scenes';
import * as filtersStore from '@store/filters';
import * as mapStore from '@store/map';
import * as uiStore from '@store/ui';
import moment2 from 'moment';

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
    private hyp3Service: services.Hyp3Service,
    private sarviewsService: services.SarviewsEventsService,
    private http: HttpClient,
    private notificationService: services.NotificationService,
    private netCdfService: services.NetcdfServiceService
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

  public setEventSearchProductsOnClear = createEffect(() => this.actions$.pipe(
    ofType<ClearScenes>(ScenesActionType.CLEAR),
    withLatestFrom(this.store$.select(getSearchType)),
    switchMap(([_, searchType]) => {
      if(searchType === SearchType.SARVIEWS_EVENTS) {
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
      if (searchType === SearchType.TIMESERIES) {
        return this.timeseriesQuery$();
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
      let output : any[] = [
        new scenesStore.SetScenes({
          products: action.payload.files,
          searchType: action.payload.searchType
        })
      ];
      if(action.payload.totalCount) {
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

      const params = {'granule_list': (<any>granuleNames).join(',')};

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

  // switchMap(action => {
  //   let output : any[] = [
  //     new scenesStore.SetScenes({
  //       products: action.payload.files,
  //       searchType: action.payload.searchType
  //     })
  //   ];
  //   if(action.payload.totalCount) {
  //     output.push(new SetSearchAmount(action.payload.totalCount))
  //   }
  //   return output
  // })

  public timeseriesSearchResponse = createEffect(() => this.actions$.pipe(
    ofType<TimeseriesSearchResponse>(SearchActionType.TIMESERIES_SEARCH_RESPONSE),
    withLatestFrom(this.store$.select(getSearchType)),
    filter(([_, searchType]) => searchType === SearchType.TIMESERIES),
    switchMap(([action, _]) => {
      console.log('SEARCH RESPONSE')
      console.log(action)
      
      return [
        new scenesStore.SetScenes({
          products: [{
            name: "test",
            productTypeDisplay: "test",
            file: "test",
            id: "test",
            downloadUrl: "test",
            bytes: 1234,
            browses: [],
            thumbnail: "string",
            dataset: "sentinel-1",
            groupId: "string",
            isUnzippedFile: false,
            isDummyProduct: false,
          
            metadata: {
              date: moment2(),
              stopDate: moment2(),
              polygon: "POLYGON ((-120.6596489990334 38.10046393341369, -120.7165475579197 38.10851198053945, -120.766930740861 38.11562044217759, -120.8205210213509 38.12315205210022, -120.8714495693995 38.13028813229113, -120.9237420515751 38.13758904376237, -120.9763848233747 38.14491322663075, -121.0284993874585 38.15213949038783, -121.0805374061872 38.15933042899581, -121.1317842372317 38.16638876359664, -121.1831324092139 38.17343685331883, -121.2343267090171 38.1804400907544, -121.2851343767767 38.18736716519965, -121.3356959243903 38.19423758535788, -121.3861081098637 38.20106467487116, -121.4362721727969 38.20783544395677, -121.48323466170885 38.21415300334824, -121.4961042842803 38.15636388218255, -121.5433137463578 38.16270254678292, -121.5911446754841 38.1691031129965, -121.6386899947014 38.17544523556456, -121.6861407154369 38.18175427917799, -121.7332794261246 38.18800202289999, -121.7803915044837 38.19422601057961, -121.827141292521 38.20038272861196, -121.8737037166488 38.20649520761842, -121.9200946535652 38.21256588219698, -121.9662943385527 38.21859236147657, -122.0122835841423 38.22457236130022, -122.0581361973249 38.23051573928061, -122.1041763492786 38.23646390681441, -122.149693424194 38.24232638029159, -122.1961235981019 38.24828575950047, -122.242840340764 38.25426186141181, -122.2851111656349 38.25965821461571, -122.3300033441712 38.2653676014464, -122.3758025278513 38.27117216227268, -122.4195396691845 38.27670031010642, -122.3858453485523 38.44296136955153, -122.3532454174394 38.60872264056508, -122.321281901071 38.77481263179438, -122.2870678391941 38.9402423639722, -122.28657198358258 38.94018057384403, -122.2484647545139 39.10551216594683, -122.2139845790114 39.27116104878576, -122.1797260176706 39.4367089374228, -122.1454462898122 39.60250573468526, -122.1112187045845 39.76830723022915, -122.0657227757032 39.76272908715357, -122.0199986201785 39.75710391072595, -121.974167995761 39.75144665647245, -121.9280106375743 39.74573006489359, -121.8819129486135 39.74000139035989, -121.8355618840318 39.73422190999039, -121.7893509902118 39.72844019721962, -121.7438269303752 39.72272426697831, -121.6969816389773 39.71682457472104, -121.6515073229837 39.71107635608378, -121.6043191954164 39.70509395348859, -121.5584565168173 39.69925815820748, -121.5109102827927 39.69319018010273, -121.4645931051444 39.68725740118437, -121.4191841855194 39.68142061388765, -121.3710837028612 39.67522101887367, -121.3249639873766 39.66925411189222, -121.2737070377029 39.66260665395009, -121.23414991223851 39.657450537553174, -121.2225423730193 39.71501508524592, -121.1765350243167 39.70900995464177, -121.1256787673412 39.70235510426308, -121.0761429466098 39.6958485542612, -121.0248065795119 39.68908396631235, -120.9731471040036 39.68225266837984, -120.9238122923641 39.67570292460091, -120.8690679290765 39.66841567043333, -120.8147668765373 39.66115958039808, -120.7685909543843 39.65495848719279, -120.7156528937689 39.64783419415447, -120.663007754518 39.64072322969391, -120.6113623558398 39.6337213126097, -120.5575229174151 39.62639828522865, -120.4998084040708 39.61852276683964, -120.4452699517613 39.61104894626836, -120.3863396198317 39.60294709422497, -120.3350203072667 39.59585767211257, -120.2794058786818 39.5881523754319, -120.2276117469398 39.58094649107327, -120.22744443645614 39.58092314818873, -120.2134545404021 39.63753782618391, -120.1722737074452 39.6317932200585, -120.1244336159495 39.62510726553644, -120.0702567931258 39.61751657755807, -120.022269227435 39.61076456269333, -119.9734628265665 39.60387622000747, -119.9205724742573 39.59639065119934, -119.8710716027977 39.58935798135493, -119.8176837356334 39.58175135017377, -119.7678667295637 39.57462631850627, -119.7172666919774 39.56736632596481, -119.6677829890141 39.56024234859523, -119.6164294368659 39.55282685903347, -119.5655855530352 39.54546030402012, -119.5122825240406 39.53771380091477, -119.4596714762434 39.53004121358733, -119.4118356441431 39.52303826133494, -119.3539548115401 39.51454620335684, -119.2999598520621 39.50659276685604, -119.242172282983 39.49805375475951, -119.1867112941332 39.48982722325655, -119.2279582300632 39.32389259181299, -119.2695651047809 39.15814430461985, -119.3154157605841 38.99290396440068, -119.3553955782568 38.82692456194625, -119.4076391719693 38.66278010421749, -119.46426202130762 38.48267405863559, -119.4994803127931 38.33275776186966, -119.5473964124392 38.1679932576986, -119.5759619696445 38.00032674732519, -119.6328594358995 38.00892055228446, -119.685940538886 38.01691396436385, -119.735510021753 38.02435806698762, -119.7876843769492 38.0321663403309, -119.8349767585424 38.03922663419335, -119.8827140678868 38.04633197874039, -119.9336830819589 38.05389196505576, -119.9837372437618 38.06129369064131, -120.029196677421 38.0680003062205, -120.0790441003354 38.07532784287181, -120.1269111066452 38.08234457142717, -120.1767641224129 38.08962794955193, -120.2211977375846 38.09610549717873, -120.2696883291999 38.10314938009251, -120.3131576383198 38.10945036625376, -120.3570069870991 38.11578848698885, -120.4046282389668 38.12264764067351, -120.4517936234199 38.12942103705984, -120.48468630063608 38.134130553754865, -120.4964144795629 38.07720256883281, -120.5521610008301 38.08517268978709, -120.6049996926634 38.09270374285773, -120.6596489990334 38.10046393341369))",
            
              productType: "",
              beamMode: "",
              polarization: "",
              flightDirection: null,
            
              path: 1,
              frame: 1,
              absoluteOrbit: [1],
            
              stackSize: 1,
              // ALOS PALSAR
              faradayRotation: null,
              offNadirAngle:  null,
            
              // AVNIR-2
              instrument:  null,
              pointingAngle: null,
            
              // UAVSAR
              missionName:  null,
            
              // AIRSAR
              flightLine:  null,
            
              // Baseline
              perpendicular:  null,
              temporal:  null,
              canInSAR: false,
            
              // SLC BURST
              burst: null,
            
              // OPERA-S1
              opera:  null,
            
              fileName:  null,
              job:null,
            
              // versioning
              pgeVersion:  null,
            
              // BURST XML, OPERA-S1
              subproducts: [],
              parentID: "",
            
              // ARIA S1 GUNW
              ariaVersion:  null,
            }
          }],
          searchType: action.payload.searchType
        })
      ]
    })
  ))

  public showResultsMenuOnSearchResponse = createEffect(() => this.actions$.pipe(
    ofType<SearchResponse>(SearchActionType.SEARCH_RESPONSE),
    map(_ => new uiStore.OpenResultsMenu()),
  ));

  public showSarviewsEventResultsMenuOnSearchResponse = createEffect(() => this.actions$.pipe(
    ofType<SarviewsEventsResponse>(SearchActionType.SARVIEWS_SEARCH_RESPONSE),
    map(_ => new uiStore.OpenResultsMenu()),
  ));

  public showTimeseriesResultsMenuOnSearchResponse = createEffect(() => this.actions$.pipe(
    ofType<TimeseriesSearchResponse>(SearchActionType.TIMESERIES_SEARCH_RESPONSE),
    map(_ => new uiStore.OpenResultsMenu()),
  ));

  public setMapInteractionModeBasedOnSearchType = createEffect(() => this.actions$.pipe(
    ofType<SetSearchType>(SearchActionType.SET_SEARCH_TYPE_AFTER_SAVE),
    filter(action => action.payload === models.SearchType.DATASET || action.payload === models.SearchType.TIMESERIES),
    switchMap((action) => {
      let output : any[] = [
        new mapStore.SetMapInteractionMode(models.MapInteractionModeType.DRAW)
      ];
      if (action.payload === models.SearchType.TIMESERIES) {
        output.push(new mapStore.SetMapDrawMode(models.MapDrawModeType.POINT))
      }
      return output;
    })
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

  private timeseriesQuery$() {
    return this.searchParams$.getParams.pipe(
      switchMap(
        (params) =>
          this.asfApiService.query<any[]>(params).pipe(
            withLatestFrom(combineLatest([
              this.store$.select(getSearchType),
              this.store$.select(getIsCanceled),
              this.netCdfService.getTimeSeries({'lon': 1, 'lat':1}) // eventually grab params for points in this part
            ]
            )),
            map(([response, [searchType, isCanceled, timseries]]) => {
              const files = this.productService.fromResponse(response)
              return !isCanceled ?
                new TimeseriesSearchResponse({
                  files,
                  totalCount: files.length,
                  searchType,
                  timseries
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
