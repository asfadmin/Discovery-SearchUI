import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import * as moment from 'moment';

import { Observable, combineLatest } from 'rxjs';
import { map, withLatestFrom, startWith } from 'rxjs/operators';

import { AppState } from '@store';
import * as filterStore from '@store/filters';
import * as scenesStore from '@store/scenes';
import { getSearchType } from '@store/search/search.reducer';

import { MapService } from './map/map.service';
import { RangeService } from './range.service';

import * as models from '@models';
import { DrawService } from './map/draw.service';

@Injectable({
  providedIn: 'root'
})
export class SearchParamsService {
  constructor(
    private store$: Store<AppState>,
    private mapService: MapService,
    private rangeService: RangeService,
    private drawService: DrawService
  ) { }

  public getParams(): Observable<any> {
    return combineLatest(
      this.searchType$(),
      this.baselineSearchParams$(),
    ).pipe(
      withLatestFrom(this.listParam$()),
      withLatestFrom(this.filterSearchParams$()),
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
  }

  public getlatestParams(): Observable<any> {
    return combineLatest(
      this.searchType$(),
      this.listParam$(),
      this.baselineSearchParams$(),
      this.filterSearchParams$()
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
  }

  public searchType$() {
    return this.store$.select(getSearchType);
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
      this.missionParam$(),
      this.burstParams$(),
    ).pipe(
      map((params: any[]) => params
        .reduce(
          (total, param) => ({ ...total, ...param }),
          {})
      )
    );
  }

  private listParam$() {
    return this.store$.select(filterStore.getSearchList).pipe(
      withLatestFrom(this.store$.select(filterStore.getListSearchMode).pipe(
        map(mode => mode === models.ListSearchType.SCENE ? 'granule_list' : 'product_list')
      )),
      map(([searchList, param]) => ({ [param]: searchList.join(',') }))
    );
  }

  private baselineSearchParams$() {
    return this.store$.select(scenesStore.getFilterMaster).pipe(
      map(reference => ({ reference }))
    );
  }

  private missionParam$() {
    return this.store$.select(filterStore.getSelectedMission).pipe(
      map(mission => ({ collectionName: mission }))
    );
  }

  private burstParams$() {
    return combineLatest(
      this.store$.select(filterStore.getAbsoluteBurstIDs),
      this.store$.select(filterStore.getRelativeBurstIDs),
      this.store$.select(filterStore.getFullBurstIDs)
    ).pipe(
      map(([absoluteIDs, relativeIDs, fullIDs]) => {
        return {
          absoluteburstid: absoluteIDs.join(','),
          relativeburstid: relativeIDs.join(','),
          fullburstid: fullIDs.join(',')
        }
      })
    );
  }

  private searchPolygon$() {
    return combineLatest(
      this.mapService.searchPolygon$.pipe(startWith(null)),
      this.store$.select(filterStore.getShouldOmitSearchPolygon),
      this.drawService.polygon$
    ).pipe(
      map(([polygon, shouldOmitGeoRegion, asdf]) => shouldOmitGeoRegion ? null : { polygon: polygon, thing: asdf }),
      map(polygon => {
        let feature = polygon.thing;
        let points = feature?.getGeometry().getCoordinates();


        if (points && points[0].length === 5) {
          const clonedFeature = feature.clone();
          const clonedProperties = JSON.parse(JSON.stringify(feature.getProperties()));
          clonedProperties.geometry = clonedFeature.getGeometry();
          clonedFeature.setProperties(clonedProperties, true);
          feature = clonedFeature;
          const geo = feature.getGeometry();
          geo.transform(this.mapService.epsg(), 'EPSG:4326');
          points = geo.getCoordinates()[0].slice(0, 4);
          let extent = [...points[0], ...points[2]];
          if (JSON.stringify(geo.getExtent()) === JSON.stringify(extent)) {
            extent = extent.map(value => {
              if (value > 180) {
                value = value % 360 - 360;
              }
              if (value < -180) {
                value = value % 360 + 360;
              }
              return value;
            });
            return {bbox: extent.join(',')};
          }
        }


        return { intersectsWith: polygon.polygon };
      })
    );
  }

  private selectedDataset$() {
    return combineLatest(
      this.store$.select(filterStore.getSelectedDataset),
      this.store$.select(filterStore.getSubtypes)
    ).pipe(
      map(([dataset, subtypes]) => {
        return subtypes.length > 0 ?
          {
            platform: subtypes
              .map(subtype => subtype.apiValue)
              .join(',')
          } :
          { ...dataset.apiValue };
      })
    );
  }

  private dateRange$() {
    return this.store$.select(filterStore.getDateRange).pipe(
      map(range => {
        return [range.start, range.end]
          .map(date => !!date ? moment.utc(date).format() : date);
      }),
      map(([start, end]) => ({ start, end })),
    );
  }

  private season$() {
    return this.store$.select(filterStore.getSeason).pipe(
      map(range => {
        return [range.start, range.end];
      }),
      map(([start, end]) => ({ season: start && end ? `${start},${end}` : null }))
    );
  }

  private pathRange$() {
    return this.store$.select(filterStore.getPathRange).pipe(
      map(range => this.rangeService.toCMRString(range)),
      map(pathRange => ({ relativeOrbit: pathRange })),
    );
  }

  private frameRange$() {
    return this.store$.select(filterStore.getFrameRange).pipe(
      map(range => this.rangeService.toCMRString(range)),
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
      map(dirs => dirs.length > 1 ? [] : dirs),
      map(dirs => dirs.join(',')),
      map(directions => ({ flightDirection: directions }))
    );
  }

  private maxResults$() {
    return this.store$.select(filterStore.getMaxSearchResults).pipe(
      map(maxResults => ({ maxResults }))
    );
  }
}
