import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';

import { of, forkJoin, combineLatest, Observable, EMPTY } from 'rxjs';
import { map, withLatestFrom, switchMap, catchError, filter, first, tap, debounceTime } from 'rxjs/operators';

import { AppState } from '../app.reducer';
import {
  SetSearchAmount, EnableSearch, DisableSearch, SetSearchType, SetNextJobsUrl,
  Hyp3BatchResponse, SarviewsEventsResponse, SetSearchOutOfDate,
  TimeseriesSearchResponse,
  setSearchKioskMode
} from './search.action';
import * as scenesStore from '@store/scenes';
import * as filtersStore from '@store/filters';
import * as mapStore from '@store/map';
import * as uiStore from '@store/ui';
import * as hyp3Store from '@store/hyp3';
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
import * as searchStore from '@store/search';
@Injectable()
export class SearchEffects {
  private vectorSource = new VectorSource({
    format: new GeoJSON(),
  });

  constructor(
    private actions$: Actions,
    private store$: Store<AppState>,
    private searchParams: services.SearchParamsService,
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
    withLatestFrom(this.store$.select(getSearchType)),
    filter(([_, currentType]) => currentType !== SearchType.DISPLACEMENT),
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
    map(_ => new hyp3Store.ResetMaxHyp3ResultsHit())
  ));

  public setCanSearch = createEffect(() => this.actions$.pipe(
    ofType<SetSearchAmount>(SearchActionType.SET_SEARCH_AMOUNT),
    withLatestFrom(this.store$.select(getSearchType)),
    map(([action, _searchType]) =>
      (action.payload > 0) ? new EnableSearch() : new DisableSearch()
    )
  ));

  public onUpdateMaturity = createEffect(() => this.actions$.pipe(
    ofType<SetSearchAmount>(SearchActionType.SET_SEARCH_OUT_OF_DATE),
    withLatestFrom(this.searchParams.getlatestParams),
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
      } else if (searchType === SearchType.DISPLACEMENT) {
        return this.timeseriesQuery$();
      }

      this.logCountries();

      return this.asfApiQuery$;
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
              if (jobsRes.hyp3Jobs.length === 0 && jobsRes.next === '') {
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
        } else if(prod.metadata.job.job_type === 'ARIA_S1_GUNW') {
          return names.concat(prod.metadata.job.files[0]?.filename.slice(0,-3));
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
        .filter(product => !product.metadata.productType?.includes('METADATA'));

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


  public timeseriesSearchResponse = createEffect(() => this.actions$.pipe(
    ofType<TimeseriesSearchResponse>(SearchActionType.DISPLACEMENT_SEARCH_RESPONSE),
    withLatestFrom(this.store$.select(getSearchType)),
    filter(([_, searchType]) => searchType === SearchType.DISPLACEMENT),
    switchMap(([_action, _]) => {
      return [
        new scenesStore.SetScenes({
          products: [{
            name: "20221107_20221213.unw.nc",
            productTypeDisplay: "20221107_20221213.unw.nc",
            file: "20221107_20221213.unw.nc",
            id: "20221107_20221213.unw.nc",
            downloadUrl: "",
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
              faradayRotation: null,
              offNadirAngle:  null,
              instrument:  null,
              pointingAngle: null,
              missionName:  null,
              flightLine:  null,
              perpendicular:  null,
              temporal:  null,
              canInSAR: false,
              burst: null,
              opera:  null,
              fileName:  null,
              job:null,
              pgeVersion:  null,
              subproducts: [],
              nisar: null,
              parentID: "",
              ariaVersion:  null,
            }
          }],
          searchType: models.SearchType.DISPLACEMENT
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
    ofType<TimeseriesSearchResponse>(SearchActionType.DISPLACEMENT_SEARCH_RESPONSE),
    map(_ => new uiStore.OpenResultsMenu()),
  ));

  public setMapInteractionModeBasedOnSearchType = createEffect(() => this.actions$.pipe(
    ofType<SetSearchType>(SearchActionType.SET_SEARCH_TYPE_AFTER_SAVE),
    filter(action => action.payload === models.SearchType.DATASET || action.payload === models.SearchType.DISPLACEMENT),
    switchMap((action) => {
      let output : any[] = [
        new mapStore.SetMapInteractionMode(models.MapInteractionModeType.DRAW)
      ];
      if (action.payload === models.SearchType.DISPLACEMENT) {
        output.push(new mapStore.SetMapDrawMode(models.MapDrawModeType.POINT))
      } else {
        output.push(new mapStore.SetMapDrawMode(models.MapDrawModeType.BOX))
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

  public OnSetKioskMode = createEffect(() => this.actions$.pipe(
    ofType<setSearchKioskMode>(SearchActionType.SET_SEARCH_KIOSK_MODE),
    filter(action => action.payload),
    switchMap(_ => [new SetSearchType(SearchType.DISPLACEMENT), new uiStore.OpenResultsMenu()])
  ))

  private asfApiQuery$ = this.searchParams.getParams.pipe(
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

    return this.searchParams.getParams.pipe(
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
    return this.searchParams.onDemandParams$.pipe(
      switchMap(
        params => {
          let hyp3Query: Observable<{ hyp3Jobs: models.Hyp3Job[]; next: string }>;

          if (params.jobIds?.length > 0) {
            hyp3Query = this.hyp3Service.getJobsByIds$(params.jobIds);
          } else {
            hyp3Query = this.hyp3Service.getJobs$({ userID: params.userID, name: params.name });
          }

          return hyp3Query.pipe(
            switchMap(
              (jobsRes: { hyp3Jobs: models.Hyp3Job[]; next: string }) => {
                if (jobsRes.hyp3Jobs.length === 0 && jobsRes.next === '') {
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

  private timeseriesQuery$() {
    return of(new TimeseriesSearchResponse({
    }))
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
    this.searchParams.getParams.pipe(first()).subscribe(params => {
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
