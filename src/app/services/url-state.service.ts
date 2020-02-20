import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Store, Action } from '@ngrx/store';
import * as moment from 'moment';
import { filter, map, skip, tap, debounceTime } from 'rxjs/operators';

import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import * as mapStore from '@store/map';
import * as filterStore from '@store/filters';
import { SetSearchType, MakeSearch } from '@store/search/search.action';
import { getSearchType } from '@store/search/search.reducer';

import * as models from '@models';

import { MapService } from './map/map.service';
import { WktService } from './wkt.service';
import { RangeService } from './range.service';
import { PropertyService } from './property.service';


@Injectable({
  providedIn: 'root'
})
export class UrlStateService {
  private urlParamNames: string[];
  private urlParams: {[id: string]: models.UrlParameter};
  private loadLocations: {[paramName: string]: models.LoadTypes};
  private params = {};
  private dataset: string;
  private isNotLoaded = true;
  private shouldDoSearch = false;

  constructor(
    private store$: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    private mapService: MapService,
    private wktService: WktService,
    private rangeService: RangeService,
    private router: Router,
    private prop: PropertyService,
  ) {
    const params = [
      ...this.datasetParam(),
      ...this.mapParameters(),
      ...this.uiParameters(),
      ...this.filtersParameters(),
      ...this.missionParameters(),
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
      filter(params => this.isNotLoaded),
      tap(() => this.isNotLoaded = false)
    ).subscribe(
      params => {
        this.loadStateFrom(params);
    });

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
  }

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
          actions.forEach(
            action => this.store$.dispatch(action)
          );
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
      this.store$.dispatch(new filterStore.SetSelectedDataset(profile.defaultDataset));
    }
    if (this.loadLocations['maxResults'] !== models.LoadTypes.URL) {
      this.store$.dispatch(new filterStore.SetMaxResults(profile.maxResults));
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
        tap(selected => this.dataset = selected),
        map(selected => ({ dataset: selected }))
      ),
      loader: this.loadSelectedDataset
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
    }];
  }

  private filtersParameters(): models.UrlParameter[] {
    return [{
      name: 'subtypes',
      source: this.store$.select(filterStore.getSubtypes).pipe(
        map(types => types.map(subtype => subtype.apiValue).join(',')),
        map(param => ({ subtypes: param }))
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
      name: 'listSearchType',
      source: this.store$.select(filterStore.getListSearchMode).pipe(
        map(mode => ({ listSearchType: mode }))
      ),
      loader: this.loadListSearchType
    }, {
      name: 'productTypes',
      source: this.store$.select(filterStore.getProductTypes).pipe(
        map(types => types.map(key => key.apiValue).join(',')),
        map(param => ({ productTypes: param }))
      ),
      loader: this.loadProductTypes
    }, {
      name: 'beamModes',
      source: this.store$.select(filterStore.getBeamModes).pipe(
        map(modes => modes.join(',')),
        map(param => ({ beamModes: param }))
      ),
      loader: this.loadBeamModes
    }, {
      name: 'polarizations',
      source: this.store$.select(filterStore.getPolarizations).pipe(
        map(pols => pols.join(',')),
        map(param => ({ polarizations: param }))
      ),
      loader: this.loadPolarizations
    }, {
      name: 'flightDirs',
      source: this.store$.select(filterStore.getFlightDirections).pipe(
        map(dirs => dirs.join(',')),
        map(flightDirs => ({ flightDirs }))
      ),
      loader: this.loadFlightDirections
    }];
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
        map(({ lon, lat }) => ({ lon: this.limitDecimals(lon), lat: this.limitDecimals(lat) })),
        map(({ lon, lat }) => ({ center: `${lon},${lat}` }))
      ),
      loader: this.loadMapCenter
    }, {
      name: 'zoom',
      source: this.mapService.zoom$.pipe(
        map(zoom => ({ zoom }))
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
    }];
  }

  private loadSearchType = (searchType: string): Action | undefined => {
    if (!Object.values(models.SearchType).includes(searchType)) {
      return;
    }

    return new SetSearchType(<models.SearchType>searchType);
  }

  private loadMapDrawMode = (mode: string): Action | undefined => {
    if (!Object.values(models.MapDrawModeType).includes(mode)) {
      return;
    }

    return new mapStore.SetMapDrawMode(<models.MapDrawModeType>mode);
  }

  private loadMapView = (view: string): Action | undefined => {
    if (!Object.values(models.MapViewType).includes(view)) {
      return;
    }

    return new mapStore.SetMapView(<models.MapViewType>view);
  }

  private loadMapZoom = (zoomStr: string): undefined => {
    const zoom = +zoomStr;

    if (this.isNumber(zoom)) {
      this.mapService.setZoom(zoom);
    }

    return;
  }

  private loadMapCenter = (centerStr: string): undefined => {
    const center = centerStr.split(',').map(v => +v);

    if (center.length === 2 && center.every(this.isNumber)) {
      const [lon, lat] = center;

      this.mapService.setCenter({ lon, lat });
    }

    return;
  }

  private loadSelectedDataset = (datasetStr: string): Action | undefined => {
    const datasetIds = models.datasets.map(dataset => dataset.id);

    if (!datasetIds.includes(datasetStr)) {
      return;
    }

    return new filterStore.SetSelectedDataset(datasetStr);
  }

  private loadSearchPolygon = (polygon: string): undefined => {
    const features = this.wktService.wktToFeature(
      polygon,
      this.mapService.epsg()
    );

    this.mapService.setDrawFeature(features);

    return;
  }

  private loadStartDate = (start: string): Action | undefined => {
    const startDate = new Date(start);

    if (!this.isValidDate(startDate)) {
      return;
    }

    return new filterStore.SetStartDate(startDate);
  }

  private loadEndDate = (end: string): Action => {
    const endDate = new Date(end);

    if (!this.isValidDate(endDate)) {
      return;
    }

    return new filterStore.SetEndDate(endDate);
  }

  private loadSeasonStart = (start: string): Action => {
    return new filterStore.SetSeasonStart(+start);
  }

  private loadSeasonEnd = (end: string): Action => {
    return new filterStore.SetSeasonEnd(+end);
  }

  private loadPathRange = (rangeStr: string): Action[] => {
    const range = rangeStr
      .split('-')
      .map(v => +v);

    return [
      new filterStore.SetPathStart(range[0] || null),
      new filterStore.SetPathEnd(range[1] || null)
    ];
  }

  private loadFrameRange = (rangeStr: string): Action[] => {
    const range = rangeStr
      .split('-')
      .map(v => +v);

    return [
      new filterStore.SetFrameStart(range[0] || null),
      new filterStore.SetFrameEnd(range[1] || null)
    ];
  }

  private loadSearchList = (listStr: string): Action => {
    const list = listStr.split(',');

    return new filterStore.SetSearchList(list);
  }

  private loadListSearchType = (mode: string): Action | undefined => {
    if (mode === 'Granule') {
      mode = models.ListSearchType.SCENE;
    }

    if (!Object.values(models.ListSearchType).includes(mode)) {
      return;
    }

    return new filterStore.SetListSearchType(<models.ListSearchType>mode);
  }

  private loadProductTypes = (typesStr: string): Action | undefined => {
    const productTypes = this.loadProperties(
      typesStr,
      'productTypes',
      v => v.apiValue
    );

    if (!productTypes) {
      return;
    }

    return new filterStore.SetProductTypes(productTypes);
  }

  private loadBeamModes = (modesStr: string): Action | undefined => {
    const beamModes = this.loadProperties(modesStr, 'beamModes');

    if (!beamModes) {
      return;
    }

    return new filterStore.SetBeamModes(beamModes);
  }

  private loadPolarizations = (polarizationsStr: string): Action | undefined => {
    const polarizations = this.loadProperties(polarizationsStr, 'polarizations');

    if (!polarizations) {
      return;
    }

    return new filterStore.SetPolarizations(polarizations);
  }

  private loadSubtypes = (subtypesStr: string): Action | undefined => {
    const subtypes = this.loadProperties(subtypesStr, 'subtypes', v => v.apiValue);

    if (!subtypes) {
      return;
    }

    return new filterStore.SetSubtypes(subtypes);
  }

  private loadProperties(loadStr: string, datasetPropertyKey: string, keyFunc = v => v): any[] {
    const [datasetName, possibleValuesStr] = this.hasDatasetId(loadStr) ?
      this.oldFormat(loadStr) :
      this.shortFormat(loadStr);

    const possibleTypes = (possibleValuesStr || '').split(',');

    const dataset = models.datasets
        .filter(d => datasetName === d.id)
        .pop();

    if (!dataset) {
      return;
    }

    const datasetValues = dataset[datasetPropertyKey];

    const validValuesFromUrl =
      datasetValues.filter(
        value => possibleTypes.includes(keyFunc(value))
      );

    return Array.from(validValuesFromUrl);
  }

  private hasDatasetId(loadStr: string): boolean {
    return loadStr.split('$$').length === 2;
  }

  private oldFormat(loadStr: string) {
    return loadStr.split('$$');
  }

  private shortFormat(loadStr: string) {
    return [this.dataset, loadStr];
  }

  private loadFlightDirections = (dirsStr: string): Action => {
    const directions: models.FlightDirection[] = dirsStr
      .split(',')
      .filter(direction => !Object.values(models.FlightDirection).includes(direction))
      .map(direction => <models.FlightDirection>direction);

    return new filterStore.SetFlightDirections(directions);
  }

  private loadSelectedMission = (mission: string): Action => {
    return new filterStore.SelectMission(mission);
  }

  private loadAreResultsLoaded = (areLoaded: string): Action => {
    return new scenesStore.SetResultsLoaded(areLoaded === 'true');
  }

  private loadSelectedScene = (sceneId: string): Action => {
    return new scenesStore.SetSelectedScene(sceneId);
  }

  private loadMaxResults = (maxResults: string): Action | undefined => {
    const results: number = +maxResults;

    if (this.isNumber(results)) {
      const clampedResults = this.clamp(results, 1, 5000);

      return new filterStore.SetMaxResults(clampedResults);
    }
  }

  private updateShouldSearch(): void {
    this.store$.select(scenesStore.getAreResultsLoaded).pipe(
      filter(wereResultsLoaded => wereResultsLoaded),
    ).subscribe(shouldSearch => this.shouldDoSearch = true);
  }

  private isNumber = n => !isNaN(n) && isFinite(n);
  private isValidDate = (d: Date): boolean => d instanceof Date && !isNaN(d.valueOf());
  private clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max)

  private limitDecimals(num: number) {
    return num.toString().match(/^-?\d+(?:\.\d{0,6})?/)[0];
  }
}
