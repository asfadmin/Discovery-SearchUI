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
import * as missionStore from '@store/mission';

import { MapService } from './map/map.service';
import { RangeService } from './range.service';
import { PropertyService } from './property.service';

import * as models from '@models';

@Injectable({
  providedIn: 'root'
})
export class SearchParamsService {

  constructor(
    private store$: Store<AppState>,
    private mapService: MapService,
    private rangeService: RangeService,
    private prop: PropertyService,
  ) { }

  public getParams(): Observable<{[id: string]: string | null}> {
    return combineLatest(
      this.searchType$(),
      this.listParam$(),
      this.filterSearchParams$(),
      this.missionParam$(),
    ).pipe(
      map(
        ([searchType, listParam, filterParams, missionParam]) => {
          switch (searchType) {
            case models.SearchType.LIST: {
              return listParam;
            }
            case models.SearchType.DATASET: {
              return filterParams;
            }
            case models.SearchType.MISSION: {
              return missionParam;
            }
            default: {
              return filterParams;
            }
          }
        }),
    );
  }

  private searchType$() {
    return this.store$.select(uiStore.getSearchType);
  }

  private filterSearchParams$() {
    return combineLatest(
        this.searchPolygon$(),
        this.selectedDataset$(),
        this.dateRange$(),
        this.season$(),
        this.pathRange$(),
        this.frameRange$(),
        this.productType$(),
        this.flightDirections$(),
        this.beamModes$(),
        this.polarizations$(),
        this.maxResults$(),
      ).pipe(
        map((params: any[]) => params
          .reduce(
            (total, param) =>  ({...total, ...param}),
            {})
        )
    );
  }

  private listParam$() {
    return this.store$.select(filterStore.getSearchList).pipe(
      withLatestFrom(this.store$.select(filterStore.getListSearchMode).pipe(
        map(mode => mode === models.ListSearchType.GRANULE ? 'granule_list' : 'product_list')
      )),
      map(([searchList, param]) => ({ [param]: searchList.join(',') }))
    );
  }

  private missionParam$() {
    return this.store$.select(missionStore.getSelectedMission).pipe(
      map(mission => ({ collectionName: mission }))
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

  private selectedDataset$() {
    return this.store$.select(filterStore.getSelectedDataset).pipe(
      map(dataset => ({...dataset.apiValue})),
    );
  }

  private dateRange$() {
    return this.store$.select(filterStore.getDateRange).pipe(
      map(range => {
        return [range.start, range.end]
          .map(date => !!date ? date.toISOString() : date);
      }),
      map(([start, end]) => ({ start, end })),
    );
  }

  private season$() {
    return this.store$.select(filterStore.getSeason).pipe(
      map(range => {
        return [range.start, range.end];
      }),
      map(([start, end]) => ({ season: start && end ? `${start},${end}` : null}))
    );
  }

  private pathRange$() {
    return this.store$.select(filterStore.getPathRange).pipe(
      map(range => this.rangeService.toString(range)),
      map(pathRange => ({ relativeOrbit: pathRange })),
    );
  }

  private frameRange$() {
    return this.store$.select(filterStore.getFrameRange).pipe(
      map(range => this.rangeService.toString(range)),
      map(frameRange => ({ frame: frameRange })),
    );
  }

  private productType$() {
    return this.store$.select(filterStore.getProductTypes).pipe(
      map(types => types.map(type => type.apiValue)),
      map(
        types => Array.from(new Set(types))
          .join(',')
      ),
      map(types => ({ processinglevel: types }))
    );
  }

  private beamModes$() {
    return this.store$.select(filterStore.getBeamModes).pipe(
      map(
        types => Array.from(new Set(types))
          .join(',')
      ),
      map(beamModes => ({ beamSwath: beamModes }))
    );
  }

  private polarizations$() {
    return this.store$.select(filterStore.getPolarizations).pipe(
      map(
        polarizations => Array.from(new Set(polarizations))
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

  private maxResults$() {
    return this.store$.select(filterStore.getMaxSearchResults).pipe(
      map(maxResults => ({ maxResults, pageSize: maxResults }))
    );
  }
}
