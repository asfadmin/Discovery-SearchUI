import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import * as moment from 'moment';

import { combineLatest } from 'rxjs';
import { map, withLatestFrom, startWith } from 'rxjs/operators';

import { AppState } from '@store';
import * as filterStore from '@store/filters';
import * as scenesStore from '@store/scenes';
import * as hyp3Store from '@store/hyp3';
import { getSearchType } from '@store/search/search.reducer';

import { MapService } from './map/map.service';
import { RangeService } from './range.service';

import * as models from '@models';
import { DrawService } from './map/draw.service';
import { PolygonValidationService } from './polygon-validation.service';
@Injectable({
  providedIn: 'root'
})
export class SearchParamsService {
  constructor(
    private store$: Store<AppState>,
    private mapService: MapService,
    private rangeService: RangeService,
    private drawService: DrawService,
    private polygonValidationService: PolygonValidationService
  ) { }


  private listParam$ = this.store$.select(filterStore.getSearchList).pipe(
    withLatestFrom(this.store$.select(filterStore.getListSearchMode).pipe(
      map(mode => mode === models.ListSearchType.SCENE ? 'granule_list' : 'product_list')
    )),
    map(([searchList, param]) => ({ [param]: searchList.join(',') }))
  );

  private baselineSearchParams$ = this.store$.select(scenesStore.getFilterMaster).pipe(
    map(reference => ({ reference }))
  );

  private missionParam$ = this.store$.select(filterStore.getSelectedMission).pipe(
    map(mission => ({ collectionName: mission }))
  );

  private burstParams$ = this.store$.select(filterStore.getFullBurstIDs).pipe(
    map(fullIDs => ({
      fullburstid: fullIDs?.join(',')
    })
    )
  );

  private operaBurstParams$ = this.store$.select(filterStore.getOperaBurstIDs).pipe(
    map(operaIDs => ({
      operaburstid: operaIDs?.join(',')
    })
    )
  );

  private operaCalibrationParam$ = this.store$.select(filterStore.getUseCalibrationData).pipe(
    withLatestFrom(this.store$.select(filterStore.getSelectedDatasetId)),
    map(([useCalibrationData, dataset]) =>
      dataset === models.opera_s1.id && useCalibrationData ?
        ({ dataset: models.opera_s1.calibrationDatasets }) : ({}))
  )

  private groupID$ = this.store$.select(filterStore.getGroupID).pipe(
    map(groupid => ({
      groupid
    }))
  )

  private searchPolygon$ = combineLatest([
    this.mapService.searchPolygon$.pipe(startWith(null)),
    this.store$.select(filterStore.getShouldOmitSearchPolygon),
  ]
  ).pipe(
    map(([polygon, shouldOmitGeoRegion]) => shouldOmitGeoRegion ? null : { wkt: polygon }),
    map(aoi => ({intersectsWith: aoi.wkt }))
  );

  private selectedDataset$ = combineLatest([
    this.store$.select(filterStore.getSelectedDataset),
    this.store$.select(filterStore.getSubtypes)]
  ).pipe(
    map(([dataset, subtypes]) => {
      return subtypes.length > 0 ?
        {
          platform: subtypes
            .map(subtype => subtype.apiValue)
            .join(','),
          ...Object.entries(dataset.apiValue).reduce((prev, curr) => {
            if (curr[0] !== 'platform') {
              prev[curr[0]] = curr[1]
            }
            return prev
          }, {})
        } :
        { ...dataset.apiValue };
    })
  );

  private dateRange$ = this.store$.select(filterStore.getDateRange).pipe(
    map(range => {
      return [range.start, range.end]
        .map(date => !!date ? moment.utc(date).format() : date);
    }),
    map(([start, end]) => ({ start, end })),
  );

  private season$ = this.store$.select(filterStore.getSeason).pipe(
    map(range => {
      return [range.start, range.end];
    }),
    map(([start, end]) => ({ season: start && end ? `${start},${end}` : null }))
  );

  private pathRange$ = this.store$.select(filterStore.getPathRange).pipe(
    map(range => this.rangeService.toCMRString(range)),
    map(pathRange => ({ relativeOrbit: pathRange })),
  );

  private frameRange$ = this.store$.select(filterStore.getFrameRange).pipe(
    map(range => this.rangeService.toCMRString(range)),
    map(frameRange => ({ frame: frameRange })),
  );

  private productType$ = this.store$.select(filterStore.getProductTypes).pipe(
    map(types => types.map(type => type.apiValue)),
    map(
      types => Array.from(new Set(types))
        .join(',')
    ),
    map(types => ({ processinglevel: types }))
  );

  private beamModes$ = this.store$.select(filterStore.getBeamModes).pipe(
    map(
      types => Array.from(new Set(types))
        .join(',')
    ),
    withLatestFrom(this.store$.select(filterStore.getSelectedDatasetId)),
    map(([beamModes, dataset]) =>
      dataset === models.sentinel_1_bursts.id ?
        ({ beamMode: beamModes }) : ({ beamSwath: beamModes }))
  );

  private polarizations$ = this.store$.select(filterStore.getPolarizations).pipe(
    map(
      polarizations => Array.from(new Set(polarizations))
        .join(',')
    ),
    map(polarization => ({ polarization })),
  );

  private flightDirections$ = this.store$.select(filterStore.getFlightDirections).pipe(
    map(dirs => dirs.length > 1 ? [] : dirs),
    map(dirs => dirs.join(',')),
    map(directions => ({ flightDirection: directions }))
  );

  private maxResults$ = this.store$.select(filterStore.getMaxSearchResults).pipe(
    map(maxResults => ({ maxResults }))
  );
  private filterSearchParams$ = combineLatest([
    this.searchPolygon$,
    this.selectedDataset$,
    this.dateRange$,
    this.season$,
    this.pathRange$,
    this.frameRange$,
    this.productType$,
    this.flightDirections$,
    this.beamModes$,
    this.polarizations$,
    this.maxResults$,
    this.missionParam$,
    this.burstParams$,
    this.operaBurstParams$,
    this.operaCalibrationParam$,
    this.groupID$]
  ).pipe(
    map((params: any[]) => params
      .reduce(
        (total, param) => ({ ...total, ...param }),
        {})
    )
  );


  public getParams = combineLatest([
    this.store$.select(getSearchType),
    this.baselineSearchParams$]
  ).pipe(
    withLatestFrom(this.listParam$),
    withLatestFrom(this.filterSearchParams$),
    map(
      ([[[searchType, baselineParams], listParam], filterParams]) => {
        switch (searchType) {
          case models.SearchType.LIST: {
            return listParam;
          }
          case models.SearchType.DATASET: {
            return filterParams;
          }
          case models.SearchType.BASELINE: {
            return baselineParams;
          }
          case models.SearchType.SBAS: {
            return baselineParams;
          }
          case models.SearchType.CUSTOM_PRODUCTS: {
            return listParam;
          }
          default: {
            return filterParams;
          }
        }
      }),
  );

  public getlatestParams = combineLatest([
    this.store$.select(getSearchType),
    this.listParam$,
    this.baselineSearchParams$,
    this.filterSearchParams$]
  ).pipe(
    map(
      ([searchType, listParam, baselineParams, filterParams]) => {
        switch (searchType) {
          case models.SearchType.LIST: {
            return listParam;
          }
          case models.SearchType.DATASET: {
            return filterParams;
          }
          case models.SearchType.BASELINE: {
            return baselineParams;
          }
          case models.SearchType.SBAS: {
            return baselineParams;
          }
          case models.SearchType.CUSTOM_PRODUCTS: {
            return listParam;
          }
          default: {
            return filterParams;
          }
        }
      }),
  );

  public getOnDemandSearchParams = combineLatest([
    this.store$.select(hyp3Store.getOnDemandUserId)
  ]).pipe(
    map(([userID]) => {
      return {
        'userID': userID
      };
    })
  )

  public searchType$() {
    return this.store$.select(getSearchType);
  }


}
