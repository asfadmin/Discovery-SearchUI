import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Store } from '@ngrx/store';
import * as moment from 'moment';

import { combineLatest } from 'rxjs';
import { filter, map, switchMap, skip, tap, withLatestFrom, debounceTime } from 'rxjs/operators';

import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import * as mapStore from '@store/map';
import * as uiStore from '@store/ui';
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
  private urlParams: models.UrlParameter[];
  private params = {};
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
    this.urlParams = [
      ...this.mapParameters(),
      ...this.uiParameters(),
      ...this.filtersParameters(),
      ...this.missionParameters(),
    ];

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

    this.urlParams.forEach(
      param => param.source.pipe(
        skip(1),
        debounceTime(300)
      ).subscribe(
        this.updateRouteWithParams
      )
    );
  }

  private updateRouteWithParams = (queryParams: Params): void => {
    this.params = {...this.params, ...queryParams};

    this.router.navigate(['.'], {
      queryParams: this.params,
    });
  }

  private loadStateFrom(params: Params): void {
    this.params = { ...this.params, ...params };

    const urlParamLoaders: { [id: string]: (string) => void } = this.urlParams.reduce(
      (loaders, param) => {
        loaders[param.name] = param.loader;

        return loaders;
      },
      {}
    );

    Object.entries(urlParamLoaders).forEach(
      ([paramName, load]) => params[paramName] && load(params[paramName])
    );

    if (this.shouldDoSearch) {
      this.store$.dispatch(new MakeSearch());
    }
  }

  private missionParameters() {
    return [{
      name: 'mission',
      source: this.store$.select(filterStore.getSelectedMission).pipe(
        map(mission => ({ mission }))
      ),
      loader: this.loadSelectedMission
    }];
  }

  private uiParameters() {
    return [{
      name: 'selectedFilter',
      source: this.store$.select(uiStore.getSelectedFilter).pipe(
        map(selectedFilter => ({ selectedFilter }))
      ),
      loader: this.loadSelectedFilter
    }, {
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
      name: 'uiView',
      source: this.store$.select(uiStore.getUiView).pipe(
        map(uiView => ({ uiView }))
      ),
      loader: this.loadUiView
    }];
  }

  private filtersParameters() {
    return [{
      name: 'dataset',
      source: this.store$.select(filterStore.getSelectedDatasetId).pipe(
        map(selected => ({ dataset: selected }))
      ),
      loader: this.loadSelectedDataset
    }, {
      name: 'subtypes',
      source: this.store$.select(filterStore.getSubtypes).pipe(
        map(types => types.map(subtype => subtype.apiValue).join(',')),
        withLatestFrom(this.store$.select(filterStore.getSelectedDatasetId)),
        map(([types, dataset]) => `${dataset}$$${types}`),
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
        map(start => ({ start: moment.utc( start ).format() }))
      ),
      loader: this.loadStartDate
    }, {
      name: 'end',
      source: this.store$.select(filterStore.getEndDate).pipe(
        map(end => ({ end: moment.utc( end ).format() }))
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
        withLatestFrom(this.store$.select(filterStore.getSelectedDatasetId)),
        map(([types, dataset]) => `${dataset}$$${types}`),
        map(param => ({ productTypes: param }))
      ),
      loader: this.loadProductTypes
    }, {
      name: 'beamModes',
      source: this.store$.select(filterStore.getBeamModes).pipe(
        map(modes => modes.join(',')),
        withLatestFrom(this.store$.select(filterStore.getSelectedDatasetId)),
        map(([modes, dataset]) => `${dataset}$$${modes}`),
        map(param => ({ beamModes: param }))
      ),
      loader: this.loadBeamModes
    }, {
      name: 'polarizations',
      source: this.store$.select(filterStore.getPolarizations).pipe(
        map(pols => pols.join(',')),
        withLatestFrom(this.store$.select(filterStore.getSelectedDatasetId)),
        map(([pols, dataset]) => `${dataset}$$${pols}`),
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

  private mapParameters() {
    return [{
      name: 'view',
      source: this.store$.select(mapStore.getMapView).pipe(
        map(view => ({ view }))
      ),
      loader: this.loadMapView
    }, {
      name: 'center',
      source: this.mapService.center$.pipe(
        map(center => ({ center: `${center.lon},${center.lat}` }))
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

  private loadSelectedFilter = (selected: string): void => {
    if (Object.values(models.FilterType).includes(selected)) {

      const action = new uiStore.SetSelectedFilter(<models.FilterType>selected);
      this.store$.dispatch(action);
    }
  }

  private loadSearchType = (searchType: string): void => {
    if (Object.values(models.SearchType).includes(searchType)) {

      const action = new SetSearchType(<models.SearchType>searchType);
      this.store$.dispatch(action);
    }
  }

  private loadMapDrawMode = (mode: string): void => {
    if (Object.values(models.MapDrawModeType).includes(mode)) {
      const action = new mapStore.SetMapDrawMode(<models.MapDrawModeType>mode);

      this.store$.dispatch(action);
    }
  }

  private loadMapView = (view: string): void => {
    if (Object.values(models.MapViewType).includes(view)) {
      const action = new mapStore.SetMapView(<models.MapViewType>view);

      this.store$.dispatch(action);
    }
  }

  private loadMapZoom = (zoomStr: string): void => {
    const zoom = +zoomStr;

    if (this.isNumber(zoom)) {
      this.mapService.setZoom(zoom);
    }
  }

  private loadMapCenter = (centerStr: string): void => {
    const center = centerStr.split(',').map(v => +v);

    if (center.length === 2 && center.every(this.isNumber)) {
      const [lon, lat] = center;

      this.mapService.setCenter({ lon, lat });
    }
  }

  private loadSelectedDataset = (datasetStr: string): void => {

    const datasetIds = models.datasets.map(dataset => dataset.id);

    if (!datasetIds.includes(datasetStr)) {
      return;
    }

    const action = new filterStore.SetSelectedDataset(datasetStr);
    this.store$.dispatch(action);
  }

  private loadSearchPolygon = (polygon: string): void => {
    const features = this.wktService.wktToFeature(
      polygon,
      this.mapService.epsg()
    );

    this.mapService.setDrawFeature(features);
  }

  private loadStartDate = (start: string): void => {
    const startDate = new Date(start);

    if (!this.isValidDate(startDate)) {
      return;
    }

    this.store$.dispatch(new filterStore.SetStartDate(startDate));
  }

  private loadEndDate = (end: string): void => {
    const endDate = new Date(end);

    if (!this.isValidDate(endDate)) {
      return;
    }

    this.store$.dispatch(new filterStore.SetEndDate(endDate));
  }

  private loadSeasonStart = (start: string): void => {
    this.store$.dispatch(new filterStore.SetSeasonStart(+start));
  }

  private loadSeasonEnd = (end: string): void => {
    this.store$.dispatch(new filterStore.SetSeasonEnd(+end));
  }

  private loadPathRange = (rangeStr: string): void => {
    const range = rangeStr
      .split('-')
      .map(v => +v);

    this.store$.dispatch(new filterStore.SetPathStart(range[0] || null));
    this.store$.dispatch(new filterStore.SetPathEnd(range[1] || null));
  }

  private loadFrameRange = (rangeStr: string): void => {
    const range = rangeStr
      .split('-')
      .map(v => +v);

    this.store$.dispatch(new filterStore.SetFrameStart(range[0] || null));
    this.store$.dispatch(new filterStore.SetFrameEnd(range[1] || null));
  }

  private loadSearchList = (listStr: string): void => {
    const list = listStr.split(',');

    this.store$.dispatch(new filterStore.SetSearchList(list));
  }

  private loadListSearchType = (mode: string): void => {
    if (Object.values(models.ListSearchType).includes(mode)) {
      const action = new filterStore.SetListSearchType(<models.ListSearchType>mode);

      this.store$.dispatch(action);
    }
  }

  private loadProductTypes = (typesStr: string): void => {
    const productTypes = this.loadProperties(
      typesStr,
      'productTypes',
      v => v.apiValue
    );

    if (!productTypes) {
      return;
    }

    const action = new filterStore.SetProductTypes(productTypes);
    this.store$.dispatch(action);
  }

  private loadBeamModes = (modesStr: string): void => {
    const beamModes = this.loadProperties(modesStr, 'beamModes');

    if (!beamModes) {
      return;
    }

    const action = new filterStore.SetBeamModes(beamModes);
    this.store$.dispatch(action);
  }

  private loadPolarizations = (polarizationsStr: string): void => {
    const polarizations = this.loadProperties(polarizationsStr, 'polarizations');

    if (!polarizations) {
      return;
    }

    const action = new filterStore.SetPolarizations(polarizations);
    this.store$.dispatch(action);
  }

  private loadSubtypes = (subtypesStr: string): void => {
    const subtypes = this.loadProperties(subtypesStr, 'subtypes', v => v.apiValue);

    if (!subtypes) {
      return;
    }

    const action = new filterStore.SetSubtypes(subtypes);
    this.store$.dispatch(action);
  }

  private loadProperties(loadStr: string, datasetPropertyKey: string, keyFunc = v => v): any[] {
    const [datasetName, possibleValuesStr] = loadStr.split('$$');
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

  private loadFlightDirections = (dirsStr: string): void => {
    const directions: models.FlightDirection[] = dirsStr
      .split(',')
      .filter(direction => !Object.values(models.FlightDirection).includes(direction))
      .map(direction => <models.FlightDirection>direction);

    const action = new filterStore.SetFlightDirections(directions);

    this.store$.dispatch(action);
  }

  private loadUiView = (viewType: string): void => {
    if (Object.values(models.ViewType).includes(viewType)) {
      const action = new uiStore.SetUiView(<models.ViewType>viewType);

      this.store$.dispatch(action);
    }
  }

  private loadSelectedMission = (mission: string): void => {
    this.store$.dispatch(new filterStore.SelectMission(mission));
  }

  private loadAreResultsLoaded = (areLoaded: string): void => {
    this.store$.dispatch(new scenesStore.SetResultsLoaded(areLoaded === 'true'));
  }

  private loadSelectedScene = (sceneId: string): void => {
    this.store$.dispatch(new scenesStore.SetSelectedScene(sceneId));
  }

  private loadMaxResults = (maxResults: string): void => {
    const results: number = +maxResults;

    if (this.isNumber(results)) {
      const clampedResults = this.clamp(results, 1, 5000);
      this.store$.dispatch(new filterStore.SetMaxResults(clampedResults));
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

}
