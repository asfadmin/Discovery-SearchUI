import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import { combineLatest, map, Observable, startWith, withLatestFrom } from 'rxjs';

import { SearchParamsService } from './search-params.service';
import * as filterStore from '@store/filters';
import { MapService } from './map/map.service';
import { SearchType } from '@models';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor(
    private searchParamsService: SearchParamsService,
    private mapService: MapService,
    private store$: Store<AppState>,
  ) { }

  private searchPolygon$() {
    return combineLatest([
      this.mapService.searchPolygon$.pipe(startWith(null)),
      this.store$.select(filterStore.getShouldOmitSearchPolygon)
    ]
    ).pipe(
      map(([polygon, shouldOmitGeoRegion]) => shouldOmitGeoRegion ? null : { polygon: polygon }),
    );
  }

  public convertSearchOptionsToAsfSearch(): Observable<string> {
    return this.searchParamsService.getParams().pipe(
      withLatestFrom(this.searchParamsService.searchType$()),
      withLatestFrom(this.searchPolygon$()),
      map(([[options, type], wkt]) => {
        const parameters = {};
        for (const key of Object.keys(options)) {
          if (options[key]) {
            switch (key) {
              case 'bbox': {
                parameters['intersectsWith'] = wkt.polygon;
                break;
              }
              case 'processinglevel': {
                parameters['processingLevel'] = options.processinglevel;
                break;
              }
              case 'frame': {
                parameters['frame'] = parseFloat(options.frame);
                break;
              }
              case 'relativeOrbit': {
                parameters['relativeOrbit'] = parseFloat(options.relativeOrbit);
                break;
              }
              default: {
                parameters[key] = options[key];
              }
            }
          }
        }
        let search_keyword = '';
        if (type === SearchType.DATASET) {
          search_keyword = 'search';
        } else if (type === SearchType.LIST) {
          search_keyword = 'granule_search';
          console.log(parameters);
          if (parameters['product_list']) {
            search_keyword = 'product_search';
          }
        } else if (type === SearchType.BASELINE) {
          search_keyword = 'stack_from_id';
        }
        const python =
`import asf_search as asf
options = ${JSON.stringify(parameters, function replacer(key, value: String) {
  if (Array.isArray(value)) {
    return { ...value }; // Converts empty array with string properties into a POJO
  }
  if (typeof(value) === typeof('') &&  key !== 'intersectsWith') {
    if (value.includes(',')) {
      return value.split(',');
    }
  }
  return value;
}, '\t').replace(/"/g, '\'')}
results = asf.${search_keyword}(**options)
print(results)`;
        return python;
      }
      ));
  }
}
