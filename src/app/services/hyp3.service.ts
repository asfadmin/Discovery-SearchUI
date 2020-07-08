import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { of } from 'rxjs';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class Hyp3Service {
  private url = 'https://hyp3-api.asf.alaska.edu';

  constructor(
    private http: HttpClient
  ) { }

  public getJobs() {
    const getJobsUrl = `${this.url}/jobs`;
    return this.http.get(getJobsUrl, { withCredentials: true });
  }

  public submitJob(granuleId: string, description?: string) {
    const submitJobUrl = `${this.url}/jobs`;

    const body = {
      jobs: [{
        description: description || 'RTC HyP3 job',
        job_parameters: {
          granule: granuleId
        },
        job_type: 'RTC_GAMMA'
      }]
    };

    //return of(this.dummyResp());
     return this.http.post(submitJobUrl, body, { withCredentials: true });
  }

  private dummyResp() {
    return {
      'jobs': [
        {
          'description': 'RTC HyP3 job',
          'job_id': '54ff6e59-d277-4d53-b067-8750225aeaa1',
          'job_parameters': {
            'granule': 'S1A_IW_SLC__1SDV_20200701T154834_20200701T154900_033263_03DA96_C249'
          },
          'job_type': 'RTC_GAMMA',
          'request_time': '2020-07-08T14:07:49+00:00',
          'status_code': 'PENDING',
          'user_id': 'wbhorn'
        }
      ]
    };
  }
}
