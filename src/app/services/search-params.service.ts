import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { Store, Action } from '@ngrx/store';

import { Observable, combineLatest } from 'rxjs';
import { map, withLatestFrom, startWith, switchMap, tap, filter } from 'rxjs/operators';

import { AppState } from '@store';
import * as granulesStore from '@store/granules';
import * as mapStore from '@store/map';
import * as uiStore from '@store/ui';
import * as filterStore from '@store/filters';


import { MapService } from './map/map.service';
import * as models from '@models';

@Injectable({
  providedIn: 'root'
})
export class SearchParamsService {

  constructor(
    private store$: Store<AppState>,
    private mapService: MapService,
  ) { }

  public getParams() {
    return combineLatest(
      this.listParam$(),
      this.filterSearchParams$()
    ).pipe(
      map(
        ([listParam, filterParams]) =>
        Object.values(listParam)[0].length > 0 ?
          listParam :
          filterParams
      ),
      map(params => Object.entries(params)
        .filter(([param, val]) => !!val)
        .reduce(
          (queryParams, [param, val]) => queryParams.set(param, <string>val),
          new HttpParams()
        )
      ),
    );
  }

  private filterSearchParams$() {
    return combineLatest(
        this.searchPolygon$(),
        this.selectedPlatforms$(),
        this.dateRange$(),
        this.pathRange$(),
        this.frameRange$(),
        this.productType$(),
        this.flightDirections$(),
        this.beamModes$(),
        this.polarizations$(),
      ).pipe(
        map((params: any[]) => params
          .filter(param => !!Object.values(param)[0])
          .reduce(
            (total, param) =>  ({...total, ...param}),
            {})
        )
    );
  }

  private listParam$() {
    return this.store$.select(granulesStore.getSearchList).pipe(
      withLatestFrom(this.store$.select(filterStore.getListSearchMode).pipe(
        map(mode => mode === models.ListSearchType.GRANULE ? 'granule_list' : 'product_list')
      )),
      map(([searchList, param]) => ({ [param]: searchList.join(',') }))
    );
  }

  private searchPolygon$() {
    return combineLatest(
      this.mapService.searchPolygon$.pipe(startWith(null)),
      this.store$.select(filterStore.getShouldOmitSearchPolygon)
    ).pipe(
      map(([polygon, shouldOmitGeoRegion]) => shouldOmitGeoRegion ? null : polygon),
      map(polygon => ({ intersectsWith: polygon }))
    );
  }

  private selectedPlatforms$() {
    return this.store$.select(filterStore.getSelectedPlatforms).pipe(
      map(platforms => platforms
        .map(platform => platform.name)
        .join(',')
        .replace('ALOS PALSAR', 'ALOS')
      ),
      map(platforms => ({ platform: platforms }))
    );
  }

  private dateRange$() {
    return this.store$.select(filterStore.getDateRange).pipe(
      map(range => {
        return [range.start, range.end]
          .filter(date => !!date)
          .map(date => date.toISOString());
      }),
      map(([start, end]) => ({ start, end }))
    );
  }

  private pathRange$() {
    return this.rangeToApiFormat$(
        this.store$.select(filterStore.getPathRange)
    ).pipe(
      map(pathRange => ({ relativeOrbit: pathRange }))
    );
  }

  private frameRange$() {
    return this.rangeToApiFormat$(
      this.store$.select(filterStore.getFrameRange)
    ).pipe(
      map(frameRange => ({ frame: frameRange }))
    );
  }

  private rangeToApiFormat$(source: Observable<models.Range<number | null>>) {
    return source.pipe(
      map(range => Object.values(range)
        .filter(v => !!v)
      ),
      map(range => Array.from(new Set(range))),
      map(range => range.length === 2 ?
        range.join('-') :
        range.pop() || null
      )
    );
  }

  private productType$() {
    return this.store$.select(filterStore.getProductTypes).pipe(
      map(types => Object.values(types)
        .reduce((allTypes, platformProductTypes) => [
          ...allTypes, ...platformProductTypes
        ], [])
        .map(productType => productType.apiValue)
      ),
      map(
        types => Array.from(new Set(types))
          .join(',')
      ),
      map(types => ({ processinglevel: types }))
    );
  }

  private beamModes$() {
    return this.store$.select(filterStore.getBeamModes).pipe(
      map(beamModes => Object.values(beamModes)
        .reduce((allModes, platformBeamModes) => [
          ...allModes, ...platformBeamModes
        ], [])
      ),
      map(
        types => Array.from(new Set(types))
          .join(',')
      ),
      map(beamModes => ({ beamSwath: beamModes }))
    );
  }

  private polarizations$() {
    return this.store$.select(filterStore.getPolarizations).pipe(
      map(polarizations => Object.values(polarizations)
        .reduce((allPolarizations, platformPolarizations) => [
          ...allPolarizations, ...platformPolarizations
        ], [])
      ),
      map(
        polarizations => Array.from(new Set(polarizations))
          .map(pol => pol)
          .join(',')
      ),
      map(polarization => ({ polarization })),
    );
  }

  private flightDirections$() {
    return this.store$.select(filterStore.getFlightDirections).pipe(
      map(dirs => dirs.join(',')),
      map(directions => ({ flightDirection: directions }))
    );
  }
}
