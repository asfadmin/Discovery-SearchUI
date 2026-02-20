import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import { combineLatest, first, map, switchMap } from 'rxjs';

import { SearchParamsService } from './search-params.service';
import * as hyp3Store from '@store/hyp3';
import { AsfApiService } from './asf-api.service';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  private searchParamsService = inject(SearchParamsService);
  private store$ = inject<Store<AppState>>(Store);
  private apiService = inject(AsfApiService);

  public convertSearchAPIQueryToAsfSearch =
    this.searchParamsService.getParams.pipe(
      map((params) => ({ ...params, output: 'python' })),
      switchMap((params) => this.apiService.query(params)),
      first(),
    );

  public combineSearchOptionsToHyp3SDK$ = combineLatest([
    this.searchParamsService.getParams,
    this.store$.select(hyp3Store.getHyp3User),
  ]).pipe(
    map(([params, user]) => {
      console.log(params, user);
      const username = user?.user_id || 'MyUsername';

      const pythonSearchCode =
        params.jobIds?.length > 0
          ? this.hyp3JobIdSearch(params.jobIds)
          : this.hyp3FindJobsSearch(params);

      const python = `from hyp3_sdk import HyP3
hyp3 = HyP3(username='${username}', password=MyPassword)
${pythonSearchCode}
`;
      return python;
    }),
  );

  private hyp3JobIdSearch(jobIds: string[]) {
    console.log(jobIds);
    const jobIdsStr = jobIds.map((jobId) => `   '${jobId}'`).join(',\n');
    return `jobIds = [
${jobIdsStr}
]
batches = [hyp3.get_job_by_id(jobId) for jobIds]
`;
  }

  private hyp3FindJobsSearch(params) {
    const findJobParams = [];

    if (params.name) {
      findJobParams.push(`name='${params.name}'`);
    }

    if (params.userID) {
      findJobParams.push(`user_id='${params.userID}'`);
    }

    return `batch = hyp3.find_jobs(${findJobParams.join(', ')})`;
  }
}
