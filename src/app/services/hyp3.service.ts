import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

    return this.http.post(submitJobUrl, body, { withCredentials: true });
  }
}
