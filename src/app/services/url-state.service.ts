import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Store } from '@ngrx/store';

import { combineLatest } from 'rxjs';
import { filter, map, switchMap, skip, tap, withLatestFrom } from 'rxjs/operators';

import { AppState } from '@store';
import * as granulesStore from '@store/granules';
import * as mapStore from '@store/map';
import * as uiStore from '@store/ui';
import * as filterStore from '@store/filters';
import * as missionStore from '@store/mission';
import { MakeSearch } from '@store/search/search.action';

import * as models from '@models';

import { MapService } from './map/map.service';
import { WktService } from './wkt.service';
import { RangeService } from './range.service';


@Injectable({
  providedIn: 'root'
})
export class UrlStateService {
  private urlParams: models.UrlParameter[];
  private params = {};
  private isNotLoaded = true;

  constructor(
    private store$: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    private mapService: MapService,
    private wktService: WktService,
    private rangeService: RangeService,
    private router: Router,
  ) {
    this.urlParams = [
      ...this.mapParameters(),
      ...this.uiParameters(),
      ...this.filtersParameters(),
      ...this.missionParameters(),
    ];
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
      param => param.source.subscribe(
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
  }

  private missionParameters() {
    return [{
      name: 'mission',
      source: this.store$.select(missionStore.getSelectedMission).pipe(
        skip(1),
        map(mission => ({ mission }))
      ),
      loader: this.loadSelectedMission
    }];
  }

  private uiParameters() {
    return [{
      name: 'selectedFilter',
      source: this.store$.select(uiStore.getSelectedFilter).pipe(
        skip(1),
        map(selectedFilter => ({ selectedFilter }))
      ),
      loader: this.loadSelectedFilter
    }, {
      name: 'searchType',
      source: this.store$.select(uiStore.getSearchType).pipe(
        skip(1),
        map(searchType => ({ searchType }))
      ),
      loader: this.loadSearchType
    }, {
      name: 'uiView',
      source: this.store$.select(uiStore.getUiView).pipe(
        skip(1),
        map(uiView => ({ uiView }))
      ),
      loader: this.loadUiView
    }];
  }

  private filtersParameters() {
    return [{
      name: 'dataset',
      source: this.store$.select(filterStore.getSelectedDatasetName).pipe(
        skip(1),
        map(selected => ({ dataset: selected }))
      ),
      loader: this.loadSelectedDataset
    }, {
      name: 'start',
      source: this.store$.select(filterStore.getStartDate).pipe(
        skip(1),
        map(start => ({ start }))
      ),
      loader: this.loadStartDate
    }, {
      name: 'end',
      source: this.store$.select(filterStore.getEndDate).pipe(
        skip(1),
        map(end => ({ end }))
      ),
      loader: this.loadEndDate
    }, {
      name: 'seasonStart',
      source: this.store$.select(filterStore.getSeasonStart).pipe(
        skip(1),
        map(seasonStart  => ({ seasonStart }))
      ),
      loader: this.loadSeasonStart
    }, {
      name: 'seasonEnd',
      source: this.store$.select(filterStore.getSeasonEnd).pipe(
        skip(1),
        map(seasonEnd => ({ seasonEnd }))
      ),
      loader: this.loadSeasonEnd
    }, {
      name: 'path',
      source: this.store$.select(filterStore.getPathRange).pipe(
        skip(1),
        map(range => this.rangeService.toString(range)),
        map(path => ({ path }))
      ),
      loader: this.loadPathRange
    }, {
      name: 'frame',
      source: this.store$.select(filterStore.getFrameRange).pipe(
        skip(1),
        map(range => this.rangeService.toString(range)),
        map(frame => ({ frame }))
      ),
      loader: this.loadFrameRange
    }, {
      name: 'listSearchType',
      source: this.store$.select(filterStore.getListSearchMode).pipe(
        skip(1),
        map(mode => ({ listSearchType: mode }))
      ),
      loader: this.loadListSearchType
    }, {
      name: 'productTypes',
      source: this.store$.select(filterStore.getProductTypes).pipe(
        skip(1),
        map(types => types.map(key => key.apiValue).join(',')),
        withLatestFrom(this.store$.select(filterStore.getSelectedDatasetName)),
        map(([types, dataset]) => `${dataset}$$${types}`),
        map(param => ({ productTypes: param }))
      ),
      loader: this.loadProductTypes
    }, {
      name: 'beamModes',
      source: this.store$.select(filterStore.getBeamModes).pipe(
        skip(1),
        map(modes => modes.join(',')),
        withLatestFrom(this.store$.select(filterStore.getSelectedDatasetName)),
        map(([modes, dataset]) => `${dataset}$$${modes}`),
        map(param => ({ beamModes: param }))
      ),
      loader: this.loadBeamModes
    }, {
      name: 'polarizations',
      source: this.store$.select(filterStore.getPolarizations).pipe(
        skip(1),
        map(pols => pols.join(',')),
        withLatestFrom(this.store$.select(filterStore.getSelectedDatasetName)),
        map(([pols, dataset]) => `${dataset}$$${pols}`),
        map(param => ({ polarizations: param }))
      ),
      loader: this.loadPolarizations
    }, {
      name: 'flightDirs',
      source: this.store$.select(filterStore.getFlightDirections).pipe(
        skip(1),
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
        skip(1),
        map(view => ({ view }))
      ),
      loader: this.loadMapView
    }, {
      name: 'center',
      source: this.mapService.center$.pipe(
        skip(1),
        map(center => ({ center: `${center.lon},${center.lat}` }))
      ),
      loader: this.loadMapCenter
    }, {
      name: 'zoom',
      source: this.mapService.zoom$.pipe(
        skip(1),
        map(zoom => ({ zoom }))
      ),
      loader: this.loadMapZoom
    }, {
      name: 'polygon',
      source: this.mapService.searchPolygon$.pipe(
        skip(1),
        map(polygon => ({ polygon }))
      ),
      loader: this.loadSearchPolygon
    }, {
      name: 'searchList',
      source: this.store$.select(granulesStore.getSearchList).pipe(
        skip(1),
        map(list => ({ searchList: list.join(',') }))
      ),
      loader: this.loadSearchList
    }];
  }

  private loadIsSidebarOpen = (isSidebarOpenStr: string): void => {
    const action = isSidebarOpenStr !== 'false' ?
      new uiStore.OpenSidebar() :
      new uiStore.CloseSidebar();

    this.store$.dispatch(action);
  }

  private loadIsBottomMenuOpen = (isBottomMenuOpenStr: string): void => {
    const action = isBottomMenuOpenStr === 'true' ?
      new uiStore.OpenBottomMenu() :
      new uiStore.CloseBottomMenu() ;

    this.store$.dispatch(action);
  }

  private loadSelectedFilter = (selected: string): void => {
    if (Object.values(models.FilterType).includes(selected)) {

      const action = new uiStore.SetSelectedFilter(<models.FilterType>selected);
      this.store$.dispatch(action);
    }
  }

  private loadSearchType = (searchType: string): void => {
    if (Object.values(models.SearchType).includes(searchType)) {

      const action = new uiStore.SetSearchType(<models.SearchType>searchType);
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

  private loadSelectedDataset = (dataset: string): void => {
    console.log(models.datasetNames.includes(dataset));

    if (!models.datasetNames.includes(dataset)) {
      return;
    }

    const action = new filterStore.SetSelectedDataset(dataset);
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

    this.store$.dispatch(new granulesStore.SetSearchList(list));
  }

  private loadListSearchType = (mode: string): void => {
    if (Object.values(models.ListSearchType).includes(mode)) {
      const action = new filterStore.SetListSearchType(<models.ListSearchType>mode);

      this.store$.dispatch(action);
    }
  }

  private loadBeamModes = (modesStr: string): void => {
    const [datasetName, possibleModesStr] = modesStr.split('$$');
    const possibleTypes = (possibleModesStr || '').split(',');

    const dataset = models.datasets
        .filter(d => datasetName === d.name)
        .pop();

    if (!dataset) {
      return;
    }

    const datasetModes = new Set(dataset.beamModes);

    const validModesFromUrl = new Set(
      [...possibleTypes]
        .filter(type => datasetModes.has(type))
    );

    const validTypesFromUrl = [...dataset.beamModes]
      .filter(
        type => validModesFromUrl.has(type)
      );

    const action = new filterStore.SetBeamModes(validTypesFromUrl);
    this.store$.dispatch(action);
  }

  private loadProductTypes = (typesStr: string): void => {
    const [datasetName, possibleTypesStr] = typesStr.split('$$');
    const possibleTypes = (possibleTypesStr || '').split(',');

    const dataset = models.datasets
        .filter(d => datasetName === d.name)
        .pop();

    if (!dataset) {
      return;
    }

    const datasetTypes = new Set(
      dataset.productTypes.map(t => t.apiValue)
    );

    const validTypeNamesFromUrl = new Set(
      [...possibleTypes]
        .filter(type => datasetTypes.has(type))
    );

    const validTypesFromUrl = [...dataset.productTypes]
      .filter(
        type => validTypeNamesFromUrl.has(type.apiValue)
      );

    const action = new filterStore.SetProductTypes(validTypesFromUrl);
    this.store$.dispatch(action);
  }

  private loadPolarizations = (polarizationsStr: string): void => {
    const [datasetName, possibleModesStr] = polarizationsStr.split('$$');
    const possibleTypes = (possibleModesStr || '').split(',');

    const dataset = models.datasets
        .filter(d => datasetName === d.name)
        .pop();

    if (!dataset) {
      return;
    }

    const datasetModes = new Set(dataset.polarizations);

    const validModesFromUrl = new Set(
      [...possibleTypes]
        .filter(type => datasetModes.has(type))
    );

    const validTypesFromUrl = [...dataset.polarizations]
      .filter(
        type => validModesFromUrl.has(type)
      );

    const action = new filterStore.SetPolarizations(validTypesFromUrl);
    this.store$.dispatch(action);
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
    this.store$.dispatch(new missionStore.SelectMission(mission));
  }

  private isNumber = n => !isNaN(n) && isFinite(n);
  private isValidDate = (d: Date): boolean => d instanceof Date && !isNaN(d.valueOf());
}
