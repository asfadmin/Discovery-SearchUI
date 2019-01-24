import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AsfApiService {
  public readonly apiUrl = 'https://api.daac.asf.alaska.edu/services/search/param';

  constructor(private http: HttpClient) {}

  public query(stateParams: HttpParams): Observable<any[]> {

    const params = Object.entries(this.baseParams())
    .reduce(
      (queryParams, [key, val]) => queryParams.append(key, `${val}`),
      stateParams
    );

    return this.http.get<any[]>(this.apiUrl, { params });
  }

  private dummyData(): Observable<any[]>  {
    return this.http.get<any[]>('assets/sample-data/sentinel-1a.json');
  }

  private baseParams() {
    return {
      maxResults: 100,
      output: 'json'
    };
  }
}
