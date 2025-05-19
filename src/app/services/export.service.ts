import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import { combineLatest, map, startWith, withLatestFrom } from 'rxjs';

import { SearchParamsService } from './search-params.service';
import * as filterStore from '@store/filters';
import * as hyp3Store from '@store/hyp3';
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

  private searchPolygon$ = combineLatest([
    this.mapService.searchPolygon$.pipe(startWith(null)),
    this.store$.select(filterStore.getShouldOmitSearchPolygon)
  ]
  ).pipe(
    map(([polygon, shouldOmitGeoRegion]) => shouldOmitGeoRegion ? null : { polygon: polygon }),
  );

  public convertSearchOptionsToAsfSearch = this.searchParamsService.getParams.pipe(
    withLatestFrom(this.searchParamsService.searchType$()),
    withLatestFrom(this.searchPolygon$),
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
        if (parameters['product_list']) {
          search_keyword = 'product_search';
        }
      } else if (type === SearchType.BASELINE) {
        search_keyword = 'stack_from_id';
      }
      const python =
        `import asf_search as asf
options = ${JSON.stringify(parameters, function replacer(key, value: String) {
          if (Array.isArray(value) && key != 'dataset') {
            return { ...value }; // Converts empty array with string properties into a POJO
          }
          if (typeof (value) === typeof ('') && key !== 'intersectsWith') {
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

  public combineSearchOptionsToHyp3SDK$ = combineLatest([
    this.searchParamsService.getParams,
    this.store$.select(hyp3Store.getHyp3User)
  ]).pipe(
    map(([params, user]) => {
      console.log(params, user);
      const username = user?.user_id || 'MyUsername'

      const pythonSearchCode = params.jobIds?.length > 0 ?
        this.hyp3JobIdSearch(params.jobIds) :
        this.hyp3FindJobsSearch(params);

      const python = `from hyp3_sdk import HyP3
hyp3 = HyP3(username='${username}', password=MyPassword)
${pythonSearchCode}
`
      return python
    })
  )

  private hyp3JobIdSearch(jobIds: string[]) {
    console.log(jobIds);
    const jobIdsStr = jobIds
      .map(jobId => `   '${jobId}'`)
      .join(',\n')
    return `jobIds = [
${jobIdsStr}
]
batches = [hyp3.get_job_by_id(jobId) for jobIds]
`
  }

  private hyp3FindJobsSearch(params) {
    let findJobParams = [];

    if (params.name) {
      findJobParams.push(`name='${params.name}'`)
    }

    if (params.userID) {
      findJobParams.push(`user_id='${params.userID}'`);
    }

    return `batch = hyp3.find_jobs(${findJobParams.join(', ')})`
  }
}
