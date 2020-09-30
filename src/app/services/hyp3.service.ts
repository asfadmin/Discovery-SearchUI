import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import * as models from '@models';

@Injectable({
  providedIn: 'root'
})
export class Hyp3Service {
  private url = 'https://hyp3-api.asf.alaska.edu';

  constructor(
    private http: HttpClient
  ) { }

  public getUser$(): Observable<models.Hyp3User> {
    const getUserUrl = `${this.url}/user`;

    return this.http.get<models.Hyp3User>(getUserUrl, { withCredentials: true });
  }

  public getJobs$(): Observable<models.Hyp3Job[]> {
    const getJobsUrl = `${this.url}/jobs`;
    return this.http.get(getJobsUrl, { withCredentials: true }).pipe(
      map((resp: any) => {
        if (!resp.jobs) {
          // TODO: Notify user when there is an error
          return [];
        }

        const { jobs } = resp;

        return jobs.map(job => ({
          ...job,
          expiration_time: moment.utc(job.expiration_time),
          request_time: moment.utc(job.request_time)
        }));
      })
    );
  }

  public submiteJobBatch$(jobBatch) {
    const submitJobUrl = `${this.url}/jobs`;

    return this.http.post(submitJobUrl, jobBatch, { withCredentials: true });
  }

  public submitJob$(granuleId: string, name?: string) {
    const submitJobUrl = `${this.url}/jobs`;

    const body = {
      jobs: [{
        name: name || 'RTC HyP3 job',
        job_parameters: {
          granules: [granuleId]
        },
        job_type: 'RTC_GAMMA'
      }]
    };

    return this.http.post(submitJobUrl, body, { withCredentials: true });
  }
}
