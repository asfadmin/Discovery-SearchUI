import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { EnvironmentService } from './environment.service';
import * as models from '@models';

@Injectable({
  providedIn: 'root'
})
export class Hyp3Service {
  constructor(
    private http: HttpClient,
    private env: EnvironmentService,
  ) { }

  public get apiUrl() {
    return this.env.currentEnv.hyp3_api;
  }

  public getUser$(): Observable<models.Hyp3User> {
    const getUserUrl = `${this.apiUrl}/user`;

    return this.http.get<models.Hyp3User>(getUserUrl, { withCredentials: true });
  }

  public getJobs$(): Observable<models.Hyp3Job[]> {
    const getJobsUrl = `${this.apiUrl}/jobs`;
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
    const submitJobUrl = `${this.apiUrl}/jobs`;

    return this.http.post(submitJobUrl, jobBatch, { withCredentials: true });
  }

  public submitJob$(granuleId: string, name?: string) {
    const submitJobUrl = `${this.apiUrl}/jobs`;

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
