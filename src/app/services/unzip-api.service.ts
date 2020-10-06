import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class UnzipApiService {
  constructor(
    private env: EnvironmentService,
    private http: HttpClient
  ) { }

  public get apiUrl() {
    return this.env.currentEnv.unzip;
  }

  public get datapool() {
    return this.env.currentEnv.datapool;
  }

  public load$(downloadUrl: string): Observable<any> {
    const productUnzipUrl = downloadUrl.replace('datapool', 'unzip');

    return this.http.get(productUnzipUrl, { withCredentials: true });
  }
}
