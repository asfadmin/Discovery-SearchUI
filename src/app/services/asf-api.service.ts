import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { HttpClient, HttpParams, HttpRequest, HttpEventType, HttpResponse, HttpHeaders } from '@angular/common/http';

import { PolygonValidateResponse } from '@models';

@Injectable({
  providedIn: 'root'
})
export class AsfApiService {
  public readonly apiUrl = 'https://api.daac.asf.alaska.edu/services/search/param';
  public readonly testUrl = 'https://api-test.asf.alaska.edu';

  constructor(private http: HttpClient) {}

  public query(stateParams: HttpParams): Observable<any[]> {

    const params = Object.entries(this.baseParams())
    .reduce(
      (queryParams, [key, val]) => queryParams.append(key, `${val}`),
      stateParams
    );

    return this.http.get<any[]>(this.apiUrl, { params });
  }

  public upload(files): Observable<any> {
    const formData: FormData = new FormData();
    files.forEach(file => {
      formData.append('files', file, file.name);
    });

    return this.http.post(`${this.testUrl}/services/convert/files_to_wkt`, formData);
  }

  public validate(wkt: string): Observable<any> {
    const url = 'https://api-test.asf.alaska.edu/services/validate/wkt';

    const params = new HttpParams()
    .append('wkt', wkt);

    return this.http.get<PolygonValidateResponse>(url, { params });
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
