import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Store } from '@ngrx/store';

import { combineLatest } from 'rxjs';
import { filter, map, switchMap, skip, tap } from 'rxjs/operators';

import { AppState } from '@store';
import * as granulesStore from '@store/granules';
import * as mapStore from '@store/map';
import * as uiStore from '@store/ui';
import * as filterStore from '@store/filters';

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
    ];
  }

  public load(): void {
    this.activatedRoute.queryParams.pipe(
      skip(1),
      filter(params => this.isNotLoaded),
      tap(() => this.isNotLoaded = false)
    )
    .subscribe(params => {
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

  private uiParameters() {
    return [{
      name: 'isSidebarOpen',
      source: this.store$.select(uiStore.getIsSidebarOpen).pipe(
        skip(1),
        map(isSidebarOpen => ({ isSidebarOpen }))
      ),
      loader: this.loadIsSidebarOpen
    }, {
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
    }];
  }

  private filtersParameters() {
    return [{
      name: 'platforms',
      source: this.store$.select(filterStore.getSelectedPlatformNames).pipe(
        skip(1),
        filter(platforms => platforms.size > 0),
        map(selected => ({
          platforms: Array.from(selected).join(','),
        }))
      ),
      loader: this.loadSelectedPlatforms
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
        map(types => this.objToString(types, key => key.apiValue)),
        map(param => ({ productTypes: param }))
      ),
      loader: this.loadProductTypes
    }, {
      name: 'beamModes',
      source: this.store$.select(filterStore.getBeamModes).pipe(
        skip(1),
        map(modes => this.objToString(modes)),
        map(param => ({ beamModes: param }))
      ),
      loader: this.loadBeamModes
    }, {
      name: 'polarizations',
      source: this.store$.select(filterStore.getPolarizations).pipe(
        skip(1),
        map(pols =>  this.objToString(pols)),
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

  private objToString(obj: any, key = v => v): string {
    let param = '';

    for (const [name, values] of Object.entries(obj)) {
      const valuesStr = (<any[]>values)
        .map(key)
        .join(',');

      param += `$$${name},${valuesStr}`;
    }

    return param;
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
      name: 'drawMode',
      source: this.store$.select(mapStore.getMapDrawMode).pipe(
        skip(1),
        map(drawMode => ({ drawMode })
        )
      ),
      loader: this.loadMapDrawMode
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

  private loadSelectedPlatforms = (platforms: string): void => {
    const selectedPlatforms = platforms
      .split(',')
      .filter(name => models.platformNames.includes(name));

    const action = new filterStore.SetSelectedPlatforms(selectedPlatforms);

    this.store$.dispatch(action);
  }

  public loadSearchPolygon = (polygon: string): void => {
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

  private parseValuesByPlatform(str: string) {
    return str
      .split('$$')
      .filter(s => !!s)
      .map(platformTypes => platformTypes.split(','))
      .map(
        ([platform, ...beamModes]) => ({ platform, beamModes })
      ).reduce(
        (total, { platform, beamModes }) => {
          total[platform] = beamModes;

          return total;
        }, {});
  }

  private loadBeamModes = (modesStr: string): void => {
    const possiblePlatforms = this.parseValuesByPlatform(modesStr);

    const validPlatforms = {};

    for (const platformName of Object.keys(possiblePlatforms)) {
      const platform = models.platforms
        .filter(plat => platformName === plat.name)
        .pop();

      if (!platform) {
        continue;
      }

      const possibleBeamModes = possiblePlatforms[platform.name];
      const platformBeamModes = new Set(platform.beamModes);

      const validBeamModesFromUrl = new Set(
        [...possibleBeamModes]
        .filter(mode => platformBeamModes.has(mode))
      );

      validPlatforms[platform.name] = Array.from(validBeamModesFromUrl);
    }

    this.store$.dispatch(new filterStore.SetAllBeamModes(validPlatforms));
  }

  private loadProductTypes = (typesStr: string): void => {
    const possiblePlatforms = this.parseValuesByPlatform(typesStr);

    const validPlatforms = {};

    for (const platformName of Object.keys(possiblePlatforms)) {
      const platform = models.platforms
        .filter(plat => platformName === plat.name)
        .pop();

      if (!platform) {
        continue;
      }

      const possibleTypes = possiblePlatforms[platform.name];
      const platformTypes = new Set(platform.productTypes
        .map(t => t.apiValue)
      );

      const validTypeNamesFromUrl = new Set(
        [...possibleTypes]
        .filter(type => platformTypes.has(type))
      );

      const validTypesFromUrl = [...platform.productTypes]
        .filter(
          type => validTypeNamesFromUrl.has(type.apiValue)
        );

      validPlatforms[platform.name] = validTypesFromUrl;
    }

    this.store$.dispatch(new filterStore.SetAllProductTypes(validPlatforms));
  }


  private loadPolarizations = (polarizationsStr: string): void => {
    const possiblePlatforms = this.parseValuesByPlatform(polarizationsStr);

    const validPlatforms = {};

    for (const platformName of Object.keys(possiblePlatforms)) {
      const platform = models.platforms
        .filter(plat => platformName === plat.name)
        .pop();

      if (!platform) {
        continue;
      }

      const possiblePolarizations = possiblePlatforms[platform.name];
      const platformPolarizations = new Set(platform.polarizations);

      const validPolarizationsFromUrl = new Set(
        [...possiblePolarizations]
        .filter(mode => platformPolarizations.has(mode))
      );

      validPlatforms[platform.name] = Array.from(validPolarizationsFromUrl);
    }

    this.store$.dispatch(new filterStore.SetAllPolarizations(validPlatforms));
  }


  private loadFlightDirections = (dirsStr: string): void => {
    const directions: models.FlightDirection[] = dirsStr
      .split(',')
      .filter(direction => !Object.values(models.FlightDirection).includes(direction))
      .map(direction => <models.FlightDirection>direction);

    const action = new filterStore.SetFlightDirections(directions);

    this.store$.dispatch(action);
  }


  private isNumber = n => !isNaN(n) && isFinite(n);
  private isValidDate = (d: Date): boolean => d instanceof Date && !isNaN(d.valueOf());
}
