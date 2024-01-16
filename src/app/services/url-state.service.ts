import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Store, Action } from '@ngrx/store';
import * as moment from 'moment';
import { filter, map, skip, debounceTime, take, distinctUntilChanged } from 'rxjs/operators';

import { AppState } from '@store';
import * as hyp3Store from '@store/hyp3';
import * as scenesStore from '@store/scenes';
import * as mapStore from '@store/map';
import * as filterStore from '@store/filters';
import * as uiStore from '@store/ui';
import { SetSearchType, MakeSearch } from '@store/search/search.action';
import { getSearchType } from '@store/search/search.reducer';

import * as models from '@models';

import { MapService } from './map/map.service';
import { WktService } from './wkt.service';
import { RangeService } from './range.service';
import { PropertyService } from './property.service';
import { ThemingService } from './theming.service';


@Injectable({
  providedIn: 'root'
})
export class UrlStateService {
  private urlParamNames: string[];
  private urlParams: {[id: string]: models.UrlParameter};
  private loadLocations: {[paramName: string]: models.LoadTypes};
  private params = {};
  private shouldDoSearch = false;


  public isDefaultSearch$ = this.activatedRoute.queryParams.pipe( map(params => {
    const DefaultnonGEO = 'searchType' in params && Object.keys(params).length <= 1;
    const defaultGEO = Object.keys(params).length === 0;

    return defaultGEO || DefaultnonGEO;
    })
  );

  constructor(
    private store$: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    private mapService: MapService,
    private wktService: WktService,
    private rangeService: RangeService,
    private router: Router,
    private prop: PropertyService,
    private themeService: ThemingService,
  ) {
    const params = [
      ...this.datasetParam(),
      ...this.mapParameters(),
      ...this.uiParameters(),
      ...this.filtersParameters(),
      ...this.missionParameters(),
      ...this.baselineParameters(),
      ...this.sbasParameters(),
      ...this.onDemandParameters(),
      ...this.eventMonitorParameters(),
    ];

    this.urlParamNames = params.map(param => param.name);
    this.loadLocations = this.urlParamNames.reduce((locations, paramName) => {
      locations[paramName] = models.LoadTypes.DEFAULT;

      return locations;
    }, {});
    this.urlParams = params.reduce((res, param) => {
      res[param.name] = param;

      return res;
    }, {});

    this.updateShouldSearch();
  }

  public load(): void {
    this.activatedRoute.queryParams.pipe(
      skip(1),
      take(1),
    ).subscribe(
      params => this.loadStateFrom(params)
    );

    this.urlParamNames.forEach(
      paramName => this.urlParams[paramName].source.pipe(
        skip(1),
        debounceTime(300)
      ).subscribe(
        this.updateRouteWithParams
      )
    );
  }

  private updateRouteWithParams = (queryParams: Params): void => {
    const params = {...this.params, ...queryParams};

    const paramsWithValues = Object.keys(params)
      .filter(key => params[key] !== '')
      .reduce((res, key) => (res[key] = params[key], res), {});

    this.params = paramsWithValues;

    this.router.navigate(['.'], {
      queryParams: this.params,
    });
  };

  private loadStateFrom(params: Params): void {
    this.params = { ...this.params, ...params };

    const urlParamLoaders: { [id: string]: (string) => Action | Action[] | undefined } = this.urlParamNames.reduce(
      (loaders, paramName) => {
        const param = this.urlParams[paramName];
        loaders[param.name] = param.loader;

        return loaders;
      },
      {}
    );

    Object.entries(urlParamLoaders).forEach(
      ([paramName, load]) => {
        if (!params[paramName]) {
          return;
        }

        this.loadLocations[paramName] = models.LoadTypes.URL;
        const actions = load(params[paramName]);

        if (actions === undefined) {
          return;
        }

        if (Array.isArray(actions)) {
          actions.forEach(action => this.store$.dispatch(action));
        } else {
          this.store$.dispatch(actions);
        }
      }
    );

    if (this.shouldDoSearch) {
      this.store$.dispatch(new MakeSearch());
    }
  }

  public setDefaults(profile: models.UserProfile): void {
    if (this.loadLocations['dataset'] !== models.LoadTypes.URL) {
      if (this.loadLocations['productTypes'] !== models.LoadTypes.URL) {
        this.store$.dispatch(new filterStore.SetSelectedDataset(profile.defaultDataset));
      }
    }

    if (this.loadLocations['maxResults'] !== models.LoadTypes.URL) {
      this.store$.dispatch(new filterStore.SetMaxResults(profile.maxResults));
    }

    if (profile.theme && profile.theme !== 'System Preferences') {
      this.themeService.setTheme(`theme-${profile.theme}`);
    } else if (profile.theme) {
      this.themeService.theme$.pipe(
        take(1)
      ).subscribe(
        themePreference => {
          this.themeService.setTheme(`theme-${themePreference}`);
        }
      );
    } else {
      this.themeService.setTheme('theme-light');
    }
    const action = profile.mapLayer === models.MapLayerTypes.STREET ?
      new mapStore.SetStreetView() :
      new mapStore.SetSatelliteView();

    this.store$.dispatch(action);
  }

  private datasetParam(): models.UrlParameter[] {
    return [{
      name: 'dataset',
      source: this.store$.select(filterStore.getSelectedDatasetId).pipe(
        map(selected => ({ dataset: selected }))
      ),
      loader: this.loadSelectedDataset
    }];
  }

  private baselineParameters(): models.UrlParameter[] {
    return [{
      name: 'master',
      source: this.store$.select(scenesStore.getFilterMaster).pipe(
        map(master => ({ master }))
      ),
      loader: this.loadMasterScene
    }];
  }

  private sbasParameters(): models.UrlParameter[] {
    return [{
      name: 'pairs',
      source: this.store$.select(scenesStore.getCustomPairIds).pipe(
        map(pairIds => ({
          pairs: pairIds.map(pair => pair.join(',')).join('$')
        }))
      ),
      loader: this.loadSbasPairs
    }, {
      name: 'selectedPair',
      source: this.store$.select(scenesStore.getSelectedPairIds).pipe(
        map(a => ({
            selectedPair: a?.join(',')
        })
      )),
      loader: this.loadSbasSelected
    }];
  }

  private onDemandParameters(): models.UrlParameter[] {
    return [{
      name: 'userID',
      source: this.store$.select(hyp3Store.getOnDemandUserId).pipe(
        map(userID => ({
          userID
        }))
      ),
      loader: this.loadOnDemandUserId
    },
    ];
  }


  private eventMonitorParameters(): models.UrlParameter[] {
    return [{
      name: 'eventID',
      source: this.store$.select(scenesStore.getSelectedSarviewsEvent).pipe(
        // filter(event => !!event),
        map(event => ({
          eventID: event?.event_id ?? ''
        }))
      ),
      loader: this.loadEventID
    }, {
        name: 'pinnedProducts',
        source: this.store$.select(scenesStore.getPinnedEventBrowseIDs).pipe(
          distinctUntilChanged(),
          map(ids => ({
            pinnedProducts: ids.join(',')
          }))
        ),
        loader: this.loadPinnedProducts
      }, {
        name: 'magnitude',
        source: this.store$.select(filterStore.getSarviewsMagnitudeRange).pipe(
          map(range => this.rangeService.toStringWithNegatives(range)),
          map(magnitudeRange => ({magnitude: magnitudeRange}))
        ),
        loader: this.loadMagnitudeRange
      }, {
        name: 'activeEvents',
        source: this.store$.select(filterStore.getSarviewsEventActiveFilter).pipe(
          map(activeEvents => ({activeEvents}))
        ),
        loader: this.loadOnlyActiveEvents
      }, {
        name: 'eventTypes',
        source: this.store$.select(filterStore.getSarviewsEventTypes).pipe(
          map(types => types.join(',')),
          map(eventTypes => ({eventTypes}))
        ),
        loader: this.loadEventTypes
      }, {
        name: 'eventQuery',
        source: this.store$.select(filterStore.getSarviewsEventNameFilter).pipe(
          map(eventQuery => ({eventQuery}))
        ),
        loader: this.loadEventNameFilter
      },
      {
        name: 'eventProductTypes',
        source: this.store$.select(filterStore.getHyp3ProductTypes).pipe(
          map(productTypes => productTypes.map(productType => productType.id)),
          map(productTypeStrings => productTypeStrings.join(',')),
          map(productTypes => ({eventProductTypes: productTypes ?? ''}))
        ),
        loader: this.loadEventProductTypes
      }];
  }


  private missionParameters(): models.UrlParameter[] {
    return [{
      name: 'mission',
      source: this.store$.select(filterStore.getSelectedMission).pipe(
        map(mission => ({ mission }))
      ),
      loader: this.loadSelectedMission
    }];
  }

  private uiParameters(): models.UrlParameter[] {
    return [{
      name: 'resultsLoaded',
      source: this.store$.select(scenesStore.getAreResultsLoaded).pipe(
        map(resultsLoaded => ({ resultsLoaded }))
      ),
      loader: this.loadAreResultsLoaded
    }, {
        name: 'searchType',
        source: this.store$.select(getSearchType).pipe(
          map(searchType => ({ searchType }))
        ),
        loader: this.loadSearchType
      }, {
        name: 'granule',
        source: this.store$.select(scenesStore.getSelectedScene).pipe(
          map(scene => ({ granule: !!scene ? scene.id : null }))
        ),
        loader: this.loadSelectedScene
      }, {
        name: 'topic',
        source: this.store$.select(uiStore.getHelpDialogTopic).pipe(
          map(topic => ({ topic }))
        ),
        loader: this.loadHelpTopic
      }, {
        name: 'isDlOpen',
        source: this.store$.select(uiStore.getIsDownloadQueueOpen).pipe(
          map(isDlOpen => ({ isDlOpen }))
        ),
        loader: this.loadIsDownloadQueueOpen
      }, {
        name: 'isOnDemandOpen',
        source: this.store$.select(uiStore.getIsOnDemandQueueOpen).pipe(
          map(isOnDemandOpen => ({ isOnDemandOpen }))
        ),
        loader: this.loadIsOnDemandQueueOpen
      },
      // {
      //   name: 'isImgBrowseOpen',
      //   source: this.store$.select(uiStore.getIsBrowseDialogOpen).pipe(
      //     map( isImgBrowseOpen => ({isImgBrowseOpen}))
      //   ),
      //   loader: this.loadIsImageBrowseOpen
      // }
    ];
  }

  private filtersParameters(): models.UrlParameter[] {
    return [{
      name: 'subtypes',
      source: this.store$.select(filterStore.getSubtypes).pipe(
        map(
          types => this.prop.saveProperties(types, 'subtypes', v => v.apiValue)
        )
      ),
      loader: this.loadSubtypes
    }, {
        name: 'maxResults',
        source: this.store$.select(filterStore.getMaxSearchResults).pipe(
          map(maxResults => ({ maxResults }))
        ),
        loader: this.loadMaxResults
      }, {
        name: 'start',
        source: this.store$.select(filterStore.getStartDate).pipe(
          map(start => ({ start: start === null ? '' : moment.utc( start ).format() }))
        ),
        loader: this.loadStartDate
      }, {
        name: 'end',
        source: this.store$.select(filterStore.getEndDate).pipe(
          map(end => ({ end: end === null ? '' : moment.utc( end ).format() }))
        ),
        loader: this.loadEndDate
      }, {
        name: 'seasonStart',
        source: this.store$.select(filterStore.getSeasonStart).pipe(
          map(seasonStart  => ({ seasonStart }))
        ),
        loader: this.loadSeasonStart
      }, {
        name: 'seasonEnd',
        source: this.store$.select(filterStore.getSeasonEnd).pipe(
          map(seasonEnd => ({ seasonEnd }))
        ),
        loader: this.loadSeasonEnd
      }, {
        name: 'path',
        source: this.store$.select(filterStore.getPathRange).pipe(
          map(range => this.rangeService.toString(range)),
          map(path => ({ path }))
        ),
        loader: this.loadPathRange
      }, {
        name: 'frame',
        source: this.store$.select(filterStore.getFrameRange).pipe(
          map(range => this.rangeService.toString(range)),
          map(frame => ({ frame }))
        ),
        loader: this.loadFrameRange
      }, {
        name: 'perp',
        source: this.store$.select(filterStore.getPerpendicularRange).pipe(
          map(range => this.rangeService.toStringWithNegatives(range)),
          map(perp => ({ perp }))
        ),
        loader: this.loadPerpendicularRange
      }, {
        name: 'temporal',
        source: this.store$.select(filterStore.getTemporalRange).pipe(
          map(range => this.rangeService.toStringWithNegatives(range)),
          map(temporal => ({ temporal }))
        ),
        loader: this.loadTemporalRange
      }, {
        name: 'listSearchType',
        source: this.store$.select(filterStore.getListSearchMode).pipe(
          map(mode => ({ listSearchType: mode }))
        ),
        loader: this.loadListSearchType
      }, {
        name: 'productTypes',
        source: this.store$.select(filterStore.getProductTypes).pipe(
          map(
            types => this.prop.saveProperties(types, 'productTypes', v => v.apiValue)
          ),
        ),
        loader: this.loadProductTypes
      }, {
        name: 'beamModes',
        source: this.store$.select(filterStore.getBeamModes).pipe(
          map(
            beamModes => this.prop.saveProperties(beamModes, 'beamModes')
          )
        ),
        loader: this.loadBeamModes
      }, {
        name: 'polarizations',
        source: this.store$.select(filterStore.getPolarizations).pipe(
          map(
            pols => this.prop.saveProperties(pols, 'polarizations')
          )
        ),
        loader: this.loadPolarizations
      }, {
        name: 'flightDirs',
        source: this.store$.select(filterStore.getFlightDirections).pipe(
          map(dirs => dirs.join(',')),
          map(flightDirs => ({ flightDirs }))
        ),
        loader: this.loadFlightDirections
      }, ];
  }

  private mapParameters(): models.UrlParameter[] {
    return [{
      name: 'view',
      source: this.store$.select(mapStore.getMapView).pipe(
        map(view => ({ view }))
      ),
      loader: this.loadMapView
    }, {
        name: 'center',
        source: this.mapService.center$.pipe(
          map(
            ({ lon, lat }) => ({
              lon: lon.toFixed(3),
              lat: lat.toFixed(3)
            })
          ),
          map(({ lon, lat }) => ({ center: `${lon},${lat}` }))
      ),
      loader: this.loadMapCenter
    }, {
      name: 'zoom',
      source: this.mapService.zoom$.pipe(
        map(zoom => ({ zoom: zoom.toFixed(3) }))
      ),
      loader: this.loadMapZoom
    }, {
      name: 'polygon',
      source: this.mapService.searchPolygon$.pipe(
        map(polygon => ({ polygon }))
      ),
      loader: this.loadSearchPolygon
    }, {
      name: 'searchList',
      source: this.store$.select(filterStore.getSearchList).pipe(
        map(list => ({ searchList: list.join(',') }))
      ),
      loader: this.loadSearchList
    }, {
      name: 'fullBurstIDs',
      source: this.store$.select(filterStore.getFullBurstIDs).pipe(
        map(list => ({ fullBurstIDs: list?.map(num => num.toString()).join(',') }))
      ),
      loader: this.loadFullBurstIDs
    },
    {
      name: 'operaBurstID',
      source: this.store$.select(filterStore.getOperaBurstIDs).pipe(
        map(list => ({ operaBurstID: list?.map(num => num.toString()).join(',') }))
      ),
      loader: this.loadOperaBurstIDs
    },
    {
      name: 'groupID',
      source: this.store$.select(filterStore.getGroupID).pipe(
        map(groupId => ({ groupId })
      )),
      loader: this.loadGroupId
    }];
  }

  private loadSearchType = (searchType: string): Action | undefined => {
    if (!Object.values(models.SearchType).includes(<models.SearchType>searchType)) {
      return;
    }

    return new SetSearchType(<models.SearchType>searchType);
  };

  private loadMapView = (view: string): Action | undefined => {
    if (!Object.values(models.MapViewType).includes(<models.MapViewType>view)) {
      return;
    }

    return new mapStore.SetMapView(<models.MapViewType>view);
  };

  private loadMapZoom = (zoomStr: string): undefined => {
    const zoom = +zoomStr;

    if (this.isNumber(zoom)) {
      this.mapService.setZoom(zoom);
    }

    return;
  };

  private loadMapCenter = (centerStr: string): undefined => {
    const center = centerStr.split(',').map(v => +v);

    if (center.length === 2 && center.every(this.isNumber)) {
      const [lon, lat] = center;

      this.mapService.setCenter({ lon, lat });
    }

    return;
  };

  private loadSelectedDataset = (datasetStr: string): Action | undefined => {
    const datasetIds = models.datasetIds;

    if (!datasetIds.includes(datasetStr)) {
      return;
    }

    return new filterStore.SetSelectedDataset(datasetStr);
  };

  private loadSearchPolygon = (polygon: string): undefined => {
    const features = this.wktService.wktToFeature(
      polygon,
      this.mapService.epsg()
    );

    this.mapService.setDrawFeature(features);

    return;
  };

  private loadStartDate = (start: string): Action | undefined => {
    const startDate = new Date(start);

    if (!this.isValidDate(startDate)) {
      return;
    }

    return new filterStore.SetStartDate(startDate);
  };

  private loadEndDate = (end: string): Action => {
    const endDate = new Date(end);

    if (!this.isValidDate(endDate)) {
      return;
    }

    return new filterStore.SetEndDate(endDate);
  };

  private loadSeasonStart = (start: string): Action => {
    return new filterStore.SetSeasonStart(+start);
  };

  private loadSeasonEnd = (end: string): Action => {
    return new filterStore.SetSeasonEnd(+end);
  };

  private loadPathRange = (rangeStr: string): Action[] => {
    const range = rangeStr
    .split('-')
    .map(v => +v);

    return [
      new filterStore.SetPathStart(range[0] || null),
      new filterStore.SetPathEnd(range[1] || null)
    ];
  };

  private loadFrameRange = (rangeStr: string): Action[] => {
    const range = rangeStr
    .split('-')
    .map(v => +v);

    return [
      new filterStore.SetFrameStart(range[0] || null),
      new filterStore.SetFrameEnd(range[1] || null)
    ];
  };

  private loadPerpendicularRange = (rangeStr: string): Action => {
    const range = rangeStr
    .split('to')
    .map(v => +v);

    return new filterStore.SetPerpendicularRange({
      start: range[0],
      end: range[1]
    });
  };

  private loadTemporalRange = (rangeStr: string): Action => {
    const range = rangeStr
    .split('to')
    .map(v => +v);

    return new filterStore.SetTemporalRange({
      start: range[0],
      end: range[1]
    });
  };

  private loadSearchList = (listStr: string): Action => {
    const list = listStr.split(',');

    return new filterStore.SetSearchList(list);
  };

  private loadListSearchType = (mode: string): Action | undefined => {
    if (mode === 'Granule') {
      mode = models.ListSearchType.SCENE;
    }

    if (!Object.values(models.ListSearchType).includes(<models.ListSearchType>mode)) {
      return;
    }

    return new filterStore.SetListSearchType(<models.ListSearchType>mode);
  };

  private loadProductTypes = (typesStr: string): Action | undefined => {
    const productTypes: models.DatasetProductTypes = this.prop.loadProperties(
      typesStr,
      'productTypes',
      (v: models.ProductType) => v.apiValue
    );

    if (!productTypes) {
      return;
    }

    return new filterStore.SetProductTypes(productTypes);
  };

  private loadBeamModes = (modesStr: string): Action | undefined => {
    const beamModes = this.prop.loadProperties(modesStr, 'beamModes');

    if (!beamModes) {
      return;
    }

    return new filterStore.SetBeamModes(beamModes);
  };

  private loadPolarizations = (polarizationsStr: string): Action | undefined => {
    const polarizations = this.prop.loadProperties(polarizationsStr, 'polarizations');

    if (!polarizations) {
      return;
    }

    return new filterStore.SetPolarizations(polarizations);
  };

  private loadSubtypes = (subtypesStr: string): Action | undefined => {
    const subtypes = this.prop.loadProperties(subtypesStr, 'subtypes', v => v.apiValue);

    if (!subtypes) {
      return;
    }

    return new filterStore.SetSubtypes(subtypes);
  };

  private loadFlightDirections = (dirsStr: string): Action => {
    const directions: models.FlightDirection[] = dirsStr
    .split(',')
    .filter(direction => !Object.values(models.FlightDirection).includes(<models.FlightDirection>direction))
    .map(direction => <models.FlightDirection>direction);

    return new filterStore.SetFlightDirections(directions);
  };

  private loadSelectedMission = (mission: string): Action => {
    return new filterStore.SelectMission(mission);
  };

  private loadAreResultsLoaded = (areLoaded: string): Action => {
    return new scenesStore.SetResultsLoaded(areLoaded === 'true');
  };

  private loadSelectedScene = (sceneId: string): Action => {
    return new scenesStore.SetSelectedScene(sceneId);
  };

  private loadMaxResults = (maxResults: string): Action | undefined => {
    const results: number = +maxResults;

    if (this.isNumber(results)) {
      const clampedResults = this.clamp(results, 1, 5000);

      return new filterStore.SetMaxResults(clampedResults);
    }
  };

  private loadMasterScene = (master: string): Action => {
    return new scenesStore.SetFilterMaster(master);
  };

  private loadHelpTopic = (topic: string): Action => {
    return new uiStore.SetHelpDialogTopic(topic);
  };

  private loadSbasPairs = (pairsStr: string): Action => {
    const pairs = pairsStr
    .split('$')
    .map(pair => pair.split(','));

    return new scenesStore.AddCustomPairs(pairs);
  };

  private loadSbasSelected = (pair: string): Action => {
    const pairIds = pair.split(',');
    return new scenesStore.SetSelectedPair(pairIds);
  };

  private loadOnDemandUserId = (userIdStr: string): Action  => {
    console.log(userIdStr);
    return new hyp3Store.SetOnDemandUserID(userIdStr);
  }

  private loadEventID = (event_id: string): Action => new scenesStore.SetSelectedSarviewsEvent(event_id);

  private loadPinnedProducts = (pinnedProducts: string): Action => {
    const productIDs = pinnedProducts.split(',');
    return new mapStore.SetBrowseOverlays(productIDs);
  };

  private loadIsDownloadQueueOpen = (isDownloadQueueOpen: string): Action => {
    return new uiStore.SetIsDownloadQueueOpen(!!isDownloadQueueOpen);
  };

  private loadIsOnDemandQueueOpen = (isOnDemandQueueOpen: string): Action => {
    return new uiStore.SetIsOnDemandQueueOpen(!!isOnDemandQueueOpen);
  };

  private loadEventNameFilter = (eventStr: string): Action => {
    if (eventStr.length > 100) {
      return new filterStore.SetSarviewsEventNameFilter('');
    }

    return new filterStore.SetSarviewsEventNameFilter(eventStr);
  };

  private loadMagnitudeRange = (rangeStr: string): Action => {
    const range = rangeStr
    .split('to')
    .map(v => +v);

    return new filterStore.SetSarviewsMagnitudeRange({
      start: range[0],
      end: range[1]
    });
  };

  private loadEventTypes = (eventTypesStr: string): Action => {
    const eventTypes: models.SarviewsEventType[] = eventTypesStr
    .split(',')
    .filter(direction => !Object.values(models.SarviewsEventType).includes(models.SarviewsEventType[direction]))
    .map(direction => <models.SarviewsEventType>direction);

    return new filterStore.SetSarviewsEventTypes(eventTypes);
  };

  private loadOnlyActiveEvents = (activeOnly: string): Action => new filterStore.SetSarviewsEventActiveFilter(activeOnly === 'true');


  private loadEventProductTypes = (types: string): Action => {
    const productTypes = types.split(',')
    .filter(type => Object.keys(models.hyp3JobTypes)
      .find(jobType => jobType === type) !== undefined);

    if (productTypes?.length === 0) {
      return new filterStore.SetHyp3ProductTypes([]);
    }
    return new filterStore.SetHyp3ProductTypes(productTypes);
  };

  private updateShouldSearch(): void {
    this.store$.select(scenesStore.getAreResultsLoaded).pipe(
      filter(wereResultsLoaded => wereResultsLoaded),
    ).subscribe(_ => this.shouldDoSearch = true);
  }

  private isNumber = n => !isNaN(n) && isFinite(n);
  private isValidDate = (d: Date): boolean => d instanceof Date && !isNaN(d.valueOf());
  private clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

  private loadFullBurstIDs = (ids: string): Action => {
    const list = ids.split(',');
    return new filterStore.setFullBurst(list);
  };

  private loadOperaBurstIDs = (ids: string): Action => {
    const list = ids.split(',');
    return new filterStore.setOperaBurstID(list);
  };

  private loadGroupId = (id: string): Action => {
    return new filterStore.setGroupID(id);
  };
}
