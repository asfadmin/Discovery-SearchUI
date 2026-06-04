import { Injectable, inject } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Action, Store } from '@ngrx/store';
import * as moment from 'moment';
import { debounceTime, filter, map, skip, take } from 'rxjs/operators';

import { AppState } from '@store';
import * as hyp3Store from '@store/hyp3';
import * as chartsStore from '@store/charts';
import * as scenesStore from '@store/scenes';
import * as mapStore from '@store/map';
import * as filterStore from '@store/filters';
import * as uiStore from '@store/ui';
import {
  MakeSearch,
  SetHyp3PlusMode,
  setSearchKioskMode,
  SetSearchType,
} from '@store/search/search.action';
import { getSearchType } from '@store/search/search.reducer';

import * as models from '@models';
import { MapDrawModeType } from '@models';

import { MapService } from './map/map.service';
import { WktService } from './wkt.service';
import { RangeService } from './range.service';
import { PropertyService } from './property.service';
import { ThemingService } from './theming.service';
import { PointHistoryService } from './point-history.service';
import WKT from 'ol/format/WKT';
import { Geometry } from 'ol/geom';

@Injectable({
  providedIn: 'root',
})
export class UrlStateService {
  private store$ = inject<Store<AppState>>(Store);
  private activatedRoute = inject(ActivatedRoute);
  private mapService = inject(MapService);
  private wktService = inject(WktService);
  private rangeService = inject(RangeService);
  private router = inject(Router);
  private prop = inject(PropertyService);
  private themeService = inject(ThemingService);
  private pointHistoryService = inject(PointHistoryService);

  private urlParamNames: string[] = [];
  private urlParams: Record<string, models.UrlParameter>;
  private loadLocations: Record<string, models.LoadTypes> = {};
  private params = {};
  private shouldDoSearch = false;
  private defaultbooleanParams = {
    useCalibrationData: false,
  };

  private kioskMode = false; // for opera displacement
  private displacementHostNames = [
    'displacement.asf.alaska.edu',
    'displacement-test.asf.alaska.edu',
  ];

  private hyp3PlusNames = [
    'vertex-plus.asf.alaska.edu',
    'vertex-plus-test.asf.alaska.edu',
  ];

  public isDefaultSearch$ = this.activatedRoute.queryParams.pipe(
    map((params) => {
      const keys = Object.keys(params);

      const DefaultnonGEO = 'searchType' in params && keys.length <= 1;
      const defaultGEO = keys.length === 0;

      return defaultGEO || DefaultnonGEO;
    }),
  );

  constructor() {
    this.kioskMode = this.displacementHostNames.includes(
      window.location.hostname,
    );

    const hyp3Plus = this.hyp3PlusNames.includes(window.location.hostname);
    if (hyp3Plus) {
      this.store$.dispatch(new SetHyp3PlusMode(true));
    }
    let params = [];
    if (this.kioskMode) {
      this.store$.dispatch(new setSearchKioskMode(true));
      params = [
        ...this.displacementParameters(),
        ...this.displacementKioskParameters$(),
      ];
    } else {
      params = [
        ...this.datasetParam(),
        ...this.mapParameters(),
        ...this.uiParameters(),
        ...this.filtersParameters(),
        ...this.missionParameters(),
        ...this.baselineParameters(),
        ...this.sbasParameters(),
        ...this.onDemandParameters(),
        ...this.displacementParameters(),
      ];
    }

    this.urlParamNames = params.map((param) => param.name);
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
    if (this.kioskMode) {
      this.store$.dispatch(new SetSearchType(models.SearchType.DISPLACEMENT));
    }
    this.activatedRoute.queryParams
      .pipe(debounceTime(300), take(1))
      .subscribe((params) => this.loadStateFrom(params));

    this.urlParamNames.forEach((paramName) =>
      this.urlParams[paramName].source
        .pipe(skip(1), debounceTime(300))
        .subscribe(this.updateRouteWithParams),
    );
  }

  private updateRouteWithParams = (queryParams: Params): void => {
    const params = { ...this.params, ...queryParams };

    const paramsWithValues = Object.keys(params)
      .filter(
        (key) =>
          params[key] !== '' &&
          params[key] !== this.defaultbooleanParams?.[key],
      )
      .reduce((res, key) => ((res[key] = params[key]), res), {});

    this.params = paramsWithValues;

    this.router.navigate(['.'], {
      queryParams: this.params,
    });
  };

  private loadStateFrom(params: Params): void {
    this.params = { ...this.params, ...params };

    const urlParamLoaders: Record<
      string,
      (string) => Action | Action[] | undefined
    > = this.urlParamNames.reduce((loaders, paramName) => {
      const param = this.urlParams[paramName];
      loaders[param.name] = param.loader;

      return loaders;
    }, {});

    Object.entries(urlParamLoaders).forEach(([paramName, load]) => {
      if (!params[paramName]) {
        return;
      }

      this.loadLocations[paramName] = models.LoadTypes.URL;
      const actions = load(params[paramName]);

      if (actions === undefined) {
        return;
      }

      if (Array.isArray(actions)) {
        actions.forEach((action) => this.store$.dispatch(action));
      } else {
        this.store$.dispatch(actions);
      }
    });

    if (this.shouldDoSearch) {
      this.store$.dispatch(new MakeSearch());
    }
  }

  public setDefaults(profile: models.UserProfile): void {
    if (!this.kioskMode) {
      if (this.loadLocations['dataset'] !== models.LoadTypes.URL) {
        if (this.loadLocations['productTypes'] !== models.LoadTypes.URL) {
          this.store$.dispatch(
            new filterStore.SetSelectedDataset(profile.defaultDataset),
          );
        }
      }

      if (this.loadLocations['maxResults'] !== models.LoadTypes.URL) {
        this.store$.dispatch(new filterStore.SetMaxResults(profile.maxResults));
      }
    } else {
      this.store$.dispatch(new scenesStore.SetResultsLoaded(true));
    }
    if (profile.theme && profile.theme !== 'System Preferences') {
      this.themeService.setTheme(`theme-${profile.theme}`);
    } else if (profile.theme) {
      this.themeService.theme$.pipe(take(1)).subscribe((themePreference) => {
        this.themeService.setTheme(`theme-${themePreference}`);
      });
    } else {
      this.themeService.setTheme('theme-light');
    }
    const action =
      profile.mapLayer === models.MapLayerTypes.STREET
        ? new mapStore.SetStreetView()
        : new mapStore.SetSatelliteView();

    this.store$.dispatch(action);
  }

  private datasetParam(): models.UrlParameter[] {
    return [
      {
        name: 'dataset',
        source: this.store$
          .select(filterStore.getSelectedDatasetId)
          .pipe(map((selected) => ({ dataset: selected }))),
        loader: this.loadSelectedDataset,
      },
    ];
  }

  private baselineParameters(): models.UrlParameter[] {
    return [
      {
        name: 'master',
        source: this.store$
          .select(scenesStore.getFilterMaster)
          .pipe(map((master) => ({ master }))),
        loader: this.loadMasterScene,
      },
    ];
  }

  private sbasParameters(): models.UrlParameter[] {
    return [
      {
        name: 'pairs',
        source: this.store$.select(scenesStore.getCustomPairIds).pipe(
          map((pairIds) => ({
            pairs: pairIds.map((pair) => pair.join(',')).join('$'),
          })),
        ),
        loader: this.loadSbasPairs,
      },
      {
        name: 'selectedPair',
        source: this.store$.select(scenesStore.getSelectedPairIds).pipe(
          map((a) => ({
            selectedPair: a?.join(','),
          })),
        ),
        loader: this.loadSbasSelected,
      },
    ];
  }

  private onDemandParameters(): models.UrlParameter[] {
    return [
      {
        name: 'userID',
        source: this.store$.select(hyp3Store.getOnDemandUserId).pipe(
          map((userID) => ({
            userID,
          })),
        ),
        loader: this.loadOnDemandUserId,
      },
      {
        name: 'hyp3JobIds',
        source: this.store$.select(hyp3Store.getHyp3JobIds).pipe(
          map((hyp3JobIds) => ({
            hyp3JobIds: hyp3JobIds?.join(','),
          })),
        ),
        loader: this.loadHyp3JobIds,
      },
    ];
  }

  private displacementParameters() {
    return [
      {
        name: 'series',
        source: this.store$.select(chartsStore.getTimeseriesChartStates).pipe(
          map((seriesState) => {
            return {
              series: Object.values(seriesState)
                .map((x) =>
                  [
                    x.wkt,
                    x.seriesNumber,
                    x.drawMode,
                    x.uuidSeries,
                    x.seriesName,
                  ].join('--'),
                )
                .join('::'),
            };
          }),
        ),
        loader: this.loadSeriesState,
      },
      {
        name: 'dispOverview',
        source: this.mapService.displacementOverview$.pipe(
          map((dispOverview) => ({ dispOverview })),
        ),
        loader: this.loadDispOverview,
      },
      {
        name: 'isShowLinesEnabled',
        source: this.store$
          .select(chartsStore.getShowLines)
          .pipe(map((isShowLinesEnabled) => ({ isShowLinesEnabled }))),
        loader: this.loadDispShowLines,
      },
      {
        name: 'isLinearFitEnabled',
        source: this.store$
          .select(chartsStore.getShowLinearFit)
          .pipe(map((isLinearFitEnabled) => ({ isLinearFitEnabled }))),
        loader: this.loadDispShowLinearFit,
      },
      {
        name: 'referencePoint',
        source: this.store$.select(chartsStore.getTimeseriesReference).pipe(
          map((referencePoint) => ({
            referencePoint: encodeURIComponent(JSON.stringify(referencePoint)),
          })),
        ),
        loader: this.loadDispReferencePoint,
      },
    ];
  }

  private displacementKioskParameters$() {
    return [
      {
        name: 'view',
        source: this.store$
          .select(mapStore.getMapView)
          .pipe(map((view) => ({ view }))),
        loader: this.loadMapView,
      },
      {
        name: 'center',
        source: this.mapService.center$.pipe(
          map(({ lon, lat }) => ({
            lon: lon.toFixed(3),
            lat: lat.toFixed(3),
          })),
          map(({ lon, lat }) => ({ center: `${lon},${lat}` })),
        ),
        loader: this.loadMapCenter,
      },
      {
        name: 'zoom',
        source: this.mapService.zoom$.pipe(
          map((zoom) => ({ zoom: zoom.toFixed(3) })),
        ),
        loader: this.loadMapZoom,
      },
      {
        name: 'flightDirs',
        source: this.store$.select(filterStore.getFlightDirections).pipe(
          map((dirs) => dirs.join(',')),
          map((flightDirs) => ({ flightDirs })),
        ),
        loader: this.loadFlightDirections,
      },
      {
        name: 'start',
        source: this.store$.select(filterStore.getStartDate).pipe(
          map((start) => ({
            start: start === null ? '' : moment.utc(start).format(),
          })),
        ),
        loader: this.loadStartDate,
      },
      {
        name: 'end',
        source: this.store$.select(filterStore.getEndDate).pipe(
          map((end) => ({
            end: end === null ? '' : moment.utc(end).format(),
          })),
        ),
        loader: this.loadEndDate,
      },
    ];
  }

  private missionParameters(): models.UrlParameter[] {
    return [
      {
        name: 'mission',
        source: this.store$
          .select(filterStore.getSelectedMission)
          .pipe(map((mission) => ({ mission }))),
        loader: this.loadSelectedMission,
      },
    ];
  }

  private uiParameters(): models.UrlParameter[] {
    return [
      {
        name: 'resultsLoaded',
        source: this.store$
          .select(scenesStore.getAreResultsLoaded)
          .pipe(map((resultsLoaded) => ({ resultsLoaded }))),
        loader: this.loadAreResultsLoaded,
      },
      {
        name: 'searchType',
        source: this.store$
          .select(getSearchType)
          .pipe(map((searchType) => ({ searchType }))),
        loader: this.loadSearchType,
      },
      {
        name: 'granule',
        source: this.store$
          .select(scenesStore.getSelectedScene)
          .pipe(map((scene) => ({ granule: scene ? scene.id : null }))),
        loader: this.loadSelectedScene,
      },
      {
        name: 'topic',
        source: this.store$
          .select(uiStore.getHelpDialogTopic)
          .pipe(map((topic) => ({ topic }))),
        loader: this.loadHelpTopic,
      },
      {
        name: 'isDlOpen',
        source: this.store$
          .select(uiStore.getIsDownloadQueueOpen)
          .pipe(map((isDlOpen) => ({ isDlOpen }))),
        loader: this.loadIsDownloadQueueOpen,
      },
      {
        name: 'isOnDemandOpen',
        source: this.store$
          .select(uiStore.getIsOnDemandQueueOpen)
          .pipe(map((isOnDemandOpen) => ({ isOnDemandOpen }))),
        loader: this.loadIsOnDemandQueueOpen,
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
    return [
      {
        name: 'subtypes',
        source: this.store$
          .select(filterStore.getSubtypes)
          .pipe(
            map((types) =>
              this.prop.saveProperties(types, 'subtypes', (v) => v.apiValue),
            ),
          ),
        loader: this.loadSubtypes,
      },
      {
        name: 'maxResults',
        source: this.store$
          .select(filterStore.getMaxSearchResults)
          .pipe(map((maxResults) => ({ maxResults }))),
        loader: this.loadMaxResults,
      },
      {
        name: 'start',
        source: this.store$.select(filterStore.getStartDate).pipe(
          map((start) => ({
            start: start === null ? '' : moment.utc(start).format(),
          })),
        ),
        loader: this.loadStartDate,
      },
      {
        name: 'end',
        source: this.store$.select(filterStore.getEndDate).pipe(
          map((end) => ({
            end: end === null ? '' : moment.utc(end).format(),
          })),
        ),
        loader: this.loadEndDate,
      },
      {
        name: 'seasonStart',
        source: this.store$
          .select(filterStore.getSeasonStart)
          .pipe(map((seasonStart) => ({ seasonStart }))),
        loader: this.loadSeasonStart,
      },
      {
        name: 'seasonEnd',
        source: this.store$
          .select(filterStore.getSeasonEnd)
          .pipe(map((seasonEnd) => ({ seasonEnd }))),
        loader: this.loadSeasonEnd,
      },
      {
        name: 'path',
        source: this.store$.select(filterStore.getPathRange).pipe(
          map((range) => this.rangeService.toString(range)),
          map((path) => ({ path })),
        ),
        loader: this.loadPathRange,
      },
      {
        name: 'frame',
        source: this.store$.select(filterStore.getFrameRange).pipe(
          map((range) => this.rangeService.toString(range)),
          map((frame) => ({ frame })),
        ),
        loader: this.loadFrameRange,
      },
      {
        name: 'perp',
        source: this.store$.select(filterStore.getPerpendicularRange).pipe(
          map((range) => this.rangeService.toStringWithNegatives(range)),
          map((perp) => ({ perp })),
        ),
        loader: this.loadPerpendicularRange,
      },
      {
        name: 'temporal',
        source: this.store$.select(filterStore.getTemporalRange).pipe(
          map((range) => this.rangeService.toStringWithNegatives(range)),
          map((temporal) => ({ temporal })),
        ),
        loader: this.loadTemporalRange,
      },
      {
        name: 'listSearchType',
        source: this.store$
          .select(filterStore.getListSearchMode)
          .pipe(map((mode) => ({ listSearchType: mode }))),
        loader: this.loadListSearchType,
      },
      {
        name: 'productTypes',
        source: this.store$
          .select(filterStore.getProductTypes)
          .pipe(
            map((types) =>
              this.prop.saveProperties(
                types,
                'productTypes',
                (v) => v.apiValue,
              ),
            ),
          ),
        loader: this.loadProductTypes,
      },
      {
        name: 'start',
        source: this.store$.select(filterStore.getStartDate).pipe(
          map((start) => ({
            start: start === null ? '' : moment.utc(start).format(),
          })),
        ),
        loader: this.loadStartDate,
      },
      {
        name: 'end',
        source: this.store$.select(filterStore.getEndDate).pipe(
          map((end) => ({
            end: end === null ? '' : moment.utc(end).format(),
          })),
        ),
        loader: this.loadEndDate,
      },
      {
        name: 'seasonStart',
        source: this.store$
          .select(filterStore.getSeasonStart)
          .pipe(map((seasonStart) => ({ seasonStart }))),
        loader: this.loadSeasonStart,
      },
      {
        name: 'seasonEnd',
        source: this.store$
          .select(filterStore.getSeasonEnd)
          .pipe(map((seasonEnd) => ({ seasonEnd }))),
        loader: this.loadSeasonEnd,
      },
      {
        name: 'path',
        source: this.store$.select(filterStore.getPathRange).pipe(
          map((range) => this.rangeService.toString(range)),
          map((path) => ({ path })),
        ),
        loader: this.loadPathRange,
      },
      {
        name: 'frame',
        source: this.store$.select(filterStore.getFrameRange).pipe(
          map((range) => this.rangeService.toString(range)),
          map((frame) => ({ frame })),
        ),
        loader: this.loadFrameRange,
      },
      {
        name: 'perp',
        source: this.store$.select(filterStore.getPerpendicularRange).pipe(
          map((range) => this.rangeService.toStringWithNegatives(range)),
          map((perp) => ({ perp })),
        ),
        loader: this.loadPerpendicularRange,
      },
      {
        name: 'temporal',
        source: this.store$.select(filterStore.getTemporalRange).pipe(
          map((range) => this.rangeService.toStringWithNegatives(range)),
          map((temporal) => ({ temporal })),
        ),
        loader: this.loadTemporalRange,
      },
      {
        name: 'listSearchType',
        source: this.store$
          .select(filterStore.getListSearchMode)
          .pipe(map((mode) => ({ listSearchType: mode }))),
        loader: this.loadListSearchType,
      },
      {
        name: 'productTypes',
        source: this.store$
          .select(filterStore.getProductTypes)
          .pipe(
            map((types) =>
              this.prop.saveProperties(
                types,
                'productTypes',
                (v) => v.apiValue,
              ),
            ),
          ),
        loader: this.loadProductTypes,
      },
      {
        name: 'beamModes',
        source: this.store$
          .select(filterStore.getBeamModes)
          .pipe(
            map((beamModes) =>
              this.prop.saveProperties(beamModes, 'beamModes'),
            ),
          ),
        loader: this.loadBeamModes,
      },
      {
        name: 'polarizations',
        source: this.store$.select(filterStore.getPolarizations).pipe(
          map((pols) => {
            const param = pols.map((x) => x.replaceAll(',', '-')).join(',');
            return { polarizations: param };
          }),
        ),
        loader: this.loadPolarizations,
      },
      {
        name: 'flightDirs',
        source: this.store$.select(filterStore.getFlightDirections).pipe(
          map((dirs) => dirs.join(',')),
          map((flightDirs) => ({ flightDirs })),
        ),
        loader: this.loadFlightDirections,
      },
      {
        name: 'useCalibrationData',
        source: this.store$
          .select(filterStore.getUseCalibrationData)
          .pipe(map((useCalibrationData) => ({ useCalibrationData }))),
        loader: this.loadUseCalibrationData,
      },
      {
        name: 'sidePolarizations',
        source: this.store$.select(filterStore.getSidePolarizations).pipe(
          map((pols) => {
            const param = pols.map((x) => x.replaceAll(',', '-')).join(',');
            return { sidePolarizations: param };
          }),
        ),
        loader: this.loadSidePolarizations,
      },
      {
        name: 'frameCoverage',
        source: this.store$.select(filterStore.getFrameCoverage).pipe(
          map((dirs) => dirs.join(',')),
          map((frameCoverage) => ({ frameCoverage })),
        ),
        loader: this.loadFrameCoverage,
      },
      {
        name: 'jointObservation',
        source: this.store$
          .select(filterStore.getJointObservation)
          .pipe(map((jointObservation) => ({ jointObservation }))),
        loader: this.loadJointObservation,
      },
      {
        name: 'rangeBandwidths',
        source: this.store$.select(filterStore.getRangeBandwidth).pipe(
          map((bandwidths) => bandwidths.join(',')),
          map((rangeBandwidths) => ({ rangeBandwidths })),
        ),
        loader: this.loadRangeBandwidth,
      },
      {
        name: 'instruments',
        source: this.store$.select(filterStore.getInstruments).pipe(
          map((instruments) => instruments.join(',')),
          map((instruments) => ({ instruments })),
        ),
        loader: this.loadInstruments,
      },
      {
        name: 'sciProducts',
        source: this.store$.select(filterStore.getScienceProduct).pipe(
          map((sciProducts) => sciProducts.join(',')),
          map((sciProducts) => ({ sciProducts })),
        ),
        loader: this.loadSciProducts,
      },
      {
        name: 'prodConfig',
        source: this.store$.select(filterStore.getProductionConfig).pipe(
          map((configs) => configs.join(',')),
          map((prodConfig) => ({ prodConfig })),
        ),
        loader: this.loadProduction,
      },
      {
        name: 'ariaVersion',
        source: this.store$
          .select(filterStore.getAriaVersion)
          .pipe(map((ariaVersion) => ({ ariaVersion }))),
        loader: this.loadAriaVersion,
      },
      {
        name: 'tileID',
        source: this.store$
          .select(filterStore.getTileID)
          .pipe(map((tileID) => ({ tileID }))),
        loader: this.loadTileID,
      },
      {
        name: 'useFrameForBaseline',
        source: this.store$
          .select(filterStore.getShouldUseFramesForReference)
          .pipe(map((useFrameForBaseline) => ({ useFrameForBaseline }))),
        loader: this.loadUseFrameForBaseline,
      },
      {
        name: 'granuleList',
        source: this.store$
          .select(filterStore.getGranuleList)
          .pipe(map((granuleList) => ({ granuleList }))),
        loader: this.loadGranuleList,
      },
    ];
  }

  private mapParameters(): models.UrlParameter[] {
    return [
      {
        name: 'view',
        source: this.store$
          .select(mapStore.getMapView)
          .pipe(map((view) => ({ view }))),
        loader: this.loadMapView,
      },
      {
        name: 'center',
        source: this.mapService.center$.pipe(
          map(({ lon, lat }) => ({
            lon: lon.toFixed(3),
            lat: lat.toFixed(3),
          })),
          map(({ lon, lat }) => ({ center: `${lon},${lat}` })),
        ),
        loader: this.loadMapCenter,
      },
      {
        name: 'zoom',
        source: this.mapService.zoom$.pipe(
          map((zoom) => ({ zoom: zoom.toFixed(3) })),
        ),
        loader: this.loadMapZoom,
      },
      {
        name: 'polygon',
        source: this.mapService.searchPolygon$.pipe(
          map((polygon) => ({ polygon })),
        ),
        loader: this.loadSearchPolygon,
      },
      {
        name: 'searchList',
        source: this.store$
          .select(filterStore.getSearchList)
          .pipe(map((list) => ({ searchList: list.join(',') }))),
        loader: this.loadSearchList,
      },
      {
        name: 'fullBurstIDs',
        source: this.store$.select(filterStore.getFullBurstIDs).pipe(
          map((list) => ({
            fullBurstIDs: list?.map((num) => num.toString()).join(','),
          })),
        ),
        loader: this.loadFullBurstIDs,
      },
      {
        name: 'operaBurstID',
        source: this.store$.select(filterStore.getOperaBurstIDs).pipe(
          map((list) => ({
            operaBurstID: list?.map((num) => num.toString()).join(','),
          })),
        ),
        loader: this.loadOperaBurstIDs,
      },
      {
        name: 'groupId',
        source: this.store$
          .select(filterStore.getGroupID)
          .pipe(map((groupId) => ({ groupId }))),
        loader: this.loadGroupId,
      },
      {
        name: 'shortNames',
        source: this.store$.select(filterStore.getShortNames).pipe(
          map((shortNames) => ({
            shortNames: shortNames.map((name) => name.apiValue).join(','),
          })),
        ),
        loader: this.loadShortNames,
      },
    ];
  }

  private loadSearchType = (searchType: string): Action | undefined => {
    if (
      !Object.values(models.SearchType).includes(
        searchType as models.SearchType,
      )
    ) {
      return;
    }

    return new SetSearchType(searchType as models.SearchType);
  };

  private loadMapView = (view: string): Action | undefined => {
    if (
      !Object.values(models.MapViewType).includes(view as models.MapViewType)
    ) {
      return;
    }

    return new mapStore.SetMapView(view as models.MapViewType);
  };

  private loadMapZoom = (zoomStr: string): undefined => {
    const zoom = +zoomStr;

    if (this.isNumber(zoom)) {
      this.mapService.setZoom(zoom);
    }

    return;
  };

  private loadMapCenter = (centerStr: string): undefined => {
    const center = centerStr.split(',').map((v) => +v);

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
      this.mapService.epsg(),
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
    const range = rangeStr.split('-').map((v) => +v);

    return [
      new filterStore.SetPathStart(range[0] || null),
      new filterStore.SetPathEnd(range[1] || null),
    ];
  };

  private loadFrameRange = (rangeStr: string): Action[] => {
    const range = rangeStr.split('-').map((v) => +v);

    return [
      new filterStore.SetFrameStart(range[0] || null),
      new filterStore.SetFrameEnd(range[1] || null),
    ];
  };

  private loadPerpendicularRange = (rangeStr: string): Action => {
    const range = rangeStr.split('to').map((v) => +v);

    return new filterStore.SetPerpendicularRange({
      start: range[0],
      end: range[1],
    });
  };

  private loadTemporalRange = (rangeStr: string): Action => {
    const range = rangeStr.split('to').map((v) => +v);

    return new filterStore.SetTemporalRange({
      start: range[0],
      end: range[1],
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

    if (
      !Object.values(models.ListSearchType).includes(
        mode as models.ListSearchType,
      )
    ) {
      return;
    }

    return new filterStore.SetListSearchType(mode as models.ListSearchType);
  };

  private loadProductTypes = (typesStr: string): Action | undefined => {
    const productTypes: models.DatasetProductTypes = this.prop.loadProperties(
      typesStr,
      'productTypes',
      (v: models.ProductType) => v.apiValue,
    );

    if (!productTypes) {
      return;
    }

    return new filterStore.SetProductTypes(productTypes);
  };

  private loadShortNames = (shortNameStr: string): Action | undefined => {
    const shortNames: models.DatasetShortName = this.prop.loadProperties(
      shortNameStr,
      'shortNames',
      (v: models.ShortName) => v.apiValue,
    );

    if (!shortNames) {
      return;
    }

    return new filterStore.setShortNames(shortNames);
  };

  private loadBeamModes = (modesStr: string): Action | undefined => {
    const beamModes = this.prop.loadProperties(modesStr, 'beamModes');

    if (!beamModes) {
      return;
    }

    return new filterStore.SetBeamModes(beamModes);
  };

  private loadPolarizations = (
    polarizationsStr: string,
  ): Action | undefined => {
    const polarizations = this.prop.loadProperties(
      polarizationsStr,
      'polarizations',
    );

    if (!polarizations) {
      return;
    }

    return new filterStore.SetPolarizations(polarizations);
  };

  private loadSidePolarizations = (
    polarizationsStr: string,
  ): Action | undefined => {
    const polarizations = this.prop.loadProperties(
      polarizationsStr,
      'polarizations',
    );
    if (!polarizations) {
      return;
    }

    return new filterStore.SetSidePolarizations(polarizations);
  };
  private loadSubtypes = (subtypesStr: string): Action | undefined => {
    const subtypes = this.prop.loadProperties(
      subtypesStr,
      'subtypes',
      (v) => v.apiValue,
    );

    if (!subtypes) {
      return;
    }

    return new filterStore.SetSubtypes(subtypes);
  };

  private loadFlightDirections = (dirsStr: string): Action => {
    const directions: models.FlightDirection[] = dirsStr
      .split(',')
      .filter(
        (direction) =>
          !Object.values(models.FlightDirection).includes(
            this.capitalizeFirstLetter(
              direction.toLowerCase(),
            ) as models.FlightDirection,
          ),
      )
      .map((direction) => direction as models.FlightDirection);
    return new filterStore.SetFlightDirections(directions);
  };

  private capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
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
    const pairs = pairsStr.split('$').map((pair) => pair.split(','));

    return new scenesStore.AddCustomPairs(pairs);
  };

  private loadSbasSelected = (pair: string): Action => {
    const pairIds = pair.split(',');
    return new scenesStore.SetSelectedPair(pairIds);
  };

  private loadOnDemandUserId = (userIdStr: string): Action => {
    return new hyp3Store.SetOnDemandUserID(userIdStr);
  };

  private loadHyp3JobIds = (hyp3JobIdsStr: string): Action => {
    const jobIds = hyp3JobIdsStr.split(',');
    return new hyp3Store.SetHyp3JobIDs(jobIds);
  };

  private loadIsDownloadQueueOpen = (isDownloadQueueOpen: string): Action => {
    return new uiStore.SetIsDownloadQueueOpen(!!isDownloadQueueOpen);
  };

  private loadIsOnDemandQueueOpen = (isOnDemandQueueOpen: string): Action => {
    return new uiStore.SetIsOnDemandQueueOpen(!!isOnDemandQueueOpen);
  };

  private updateShouldSearch(): void {
    this.store$
      .select(scenesStore.getAreResultsLoaded)
      .pipe(filter((wereResultsLoaded) => wereResultsLoaded))
      .subscribe((_) => (this.shouldDoSearch = true));
  }

  private isNumber = (n) => !isNaN(n) && isFinite(n);
  private isValidDate = (d: Date): boolean =>
    d instanceof Date && !isNaN(d.valueOf());
  private clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

  private loadFullBurstIDs = (ids: string): Action => {
    const list = ids.split(',');
    return new filterStore.setFullBursts(list);
  };

  private loadOperaBurstIDs = (ids: string): Action => {
    // Deep links from opera products use '-' instead of '_'
    const list = ids.split(',').map((id) => id.replaceAll('-', '_'));
    return new filterStore.setOperaBurstIDs(list);
  };

  private loadGroupId = (id: string): Action => {
    return new filterStore.setGroupID(id);
  };

  private loadUseCalibrationData = (usingCalibrationData: string): Action => {
    return new filterStore.setUseCalibrationData(!!usingCalibrationData);
  };
  private loadFrameCoverage = (coverageStr: string): Action => {
    const coverage = coverageStr.split(',');
    // TODO: Add some better checking for this by grabbing from the dataset
    // .filter(direction => !Object.values(models.FlightDirection).includes(<models.FlightDirection>direction))
    // .map(direction => <models.FlightDirection>direction);

    return new filterStore.setFrameCoverage(coverage);
  };
  private loadRangeBandwidth = (bandwidthStr: string): Action => {
    const bandwidth = bandwidthStr.split(',');
    // TODO: Add some better checking for this by grabbing from the dataset
    // .filter(direction => !Object.values(models.FlightDirection).includes(<models.FlightDirection>direction))
    // .map(direction => <models.FlightDirection>direction);

    return new filterStore.setRangeBandwidth(bandwidth);
  };
  private loadInstruments = (instrumentsStr: string): Action => {
    const instruments = instrumentsStr.split(',');
    return new filterStore.setIntstrument(instruments);
  };
  private loadSciProducts = (sciProductsStr: string): Action => {
    const sciProducts = sciProductsStr.split(',');
    return new filterStore.setScienceProduct(sciProducts);
  };
  private loadProduction = (productionStr: string): Action => {
    const loadProducts = productionStr.split(',');
    return new filterStore.setProductionConfig(loadProducts);
  };
  private loadJointObservation = (observationStr: string): Action => {
    return new filterStore.setJointObservation(observationStr === 'true');
  };

  private loadUseFrameForBaseline = (
    usingseFrameForBaseline: string,
  ): Action => {
    return new filterStore.SetUseFrameForBaseline(!!usingseFrameForBaseline);
  };
  private loadGranuleList = (granuleList: string): Action => {
    return new filterStore.setGranuleList(granuleList);
  };

  private loadAriaVersion = (version: string): Action => {
    return new filterStore.setAriaVersion(version);
  };

  private loadTileID = (tileID: string): Action => {
    return new filterStore.setTileID(tileID);
  };

  private loadSeriesState = (seriesState) => {
    const states: models.timeseriesChartItemState[] = [];
    seriesState.split('::').forEach((x) => {
      const format = new WKT();
      const thing = x.split('--');
      const point = format.readFeature(thing[0]) as unknown as Geometry;
      states.push({
        uuidSeries: thing[3],
        geometry: point,
        checked: true,
        seriesNumber: thing[1],
        wkt: thing[0],
        seriesName: thing[4],
        linearFit: false,
        drawMode: thing[2] as MapDrawModeType,
      });
    });
    this.pointHistoryService.addPoints(states);
    return;
  };
  private loadDispOverview = (dispOverview) => {
    this.mapService.setDisplacementType(dispOverview);
    return;
  };
  private loadDispShowLines = (isShowLinesEnabled) => {
    if (isShowLinesEnabled === 'true') {
      this.store$.dispatch(chartsStore.showGraphLines());
    } else {
      this.store$.dispatch(chartsStore.hideGraphLines());
    }
    return;
  };
  private loadDispShowLinearFit = (isLinearFitEnabled) => {
    if (isLinearFitEnabled === 'true') {
      this.store$.dispatch(chartsStore.showLinearFit());
    } else {
      this.store$.dispatch(chartsStore.hideLinearFit());
    }
    return;
  };
  private loadDispReferencePoint = (referencePoint) => {
    const fixedString = decodeURIComponent(referencePoint); //referencePoint.slice(1,referencePoint.length-1).replace('\"','"')
    const pointObject = JSON.parse(fixedString);
    this.store$.dispatch(chartsStore.setReferenceData({ data: pointObject }));
    return;
  };
}
