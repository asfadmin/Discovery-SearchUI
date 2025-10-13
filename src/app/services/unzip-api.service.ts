import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root',
})
export class UnzipApiService {
  private env = inject(EnvironmentService);
  private http = inject(HttpClient);

  public get apiUrl() {
    return this.env.currentEnv.unzip;
  }

  public get datapool() {
    return this.env.currentEnv.datapool;
  }

  public load$(downloadUrl: string): Observable<any> {
    const datapoolUrl = 'https://datapool.asf.alaska.edu';
    const productUnzipUrl = downloadUrl.replace(datapoolUrl, this.apiUrl);

    return this.http.get(productUnzipUrl, { withCredentials: true });
  }
}
