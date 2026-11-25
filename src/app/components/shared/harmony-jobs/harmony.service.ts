import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { HarmonyJob, HarmonyJobsResp } from './harmony.model';

@Injectable({ providedIn: 'root' })
export class HarmonyService {
  private http = inject(HttpClient);

  getJobs$(token: string): Observable<HarmonyJobsResp> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<HarmonyJobsResp>(
      'https://harmony.earthdata.nasa.gov/jobs',
      {
        headers,
        withCredentials: false,
      },
    );
  }

  getJob$(jobId: string, token: string): Observable<HarmonyJob> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<HarmonyJob>(
      `https://harmony.earthdata.nasa.gov/jobs/${jobId}`,
      {
        headers,
        withCredentials: false,
      },
    );
  }
}
