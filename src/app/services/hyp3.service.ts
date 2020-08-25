import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { of, Observable } from 'rxjs';
import { map, delay, tap } from 'rxjs/operators';
import * as moment from 'moment';

import * as models from '@models';
import { AuthService } from './auth.service';

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

  public submitJob$(granuleId: string, name?: string) {
    const submitJobUrl = `${this.url}/jobs`;

    const body = {
      jobs: [{
        name: name || 'RTC HyP3 job',
        job_parameters: {
          granule: granuleId
        },
        job_type: 'RTC_GAMMA'
      }]
    };

    //return of(this.dummyResp()).pipe(delay(2000));
    return this.http.post(submitJobUrl, body, { withCredentials: true });
  }

  private dummyResp() {
    return {
      'jobs': [
        {
          'job_id': '54ff6e59-d277-4d53-b067-8750225aeaa1',
          'job_parameters': {
            'granule': 'S1A_IW_SLC__1SDV_20200701T154834_20200701T154900_033263_03DA96_C249'
          },
          'job_type': 'RTC_GAMMA',
          'name': 'RTC HyP3 job',
          'request_time': '2020-07-08T14:07:49+00:00',
          'status_code': 'PENDING',
          'user_id': 'wbhorn'
        }
      ]
    };
  }
}
