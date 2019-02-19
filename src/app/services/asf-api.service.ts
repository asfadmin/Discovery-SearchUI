import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, Subject } from 'rxjs';

import { PolygonValidateResponse } from '@models';

@Injectable({
  providedIn: 'root'
})
export class AsfApiService {
  public readonly apiUrl = 'https://api.daac.asf.alaska.edu';
  public readonly testUrl = 'https://api-test.asf.alaska.edu';
  public readonly localUrl = 'http://127.0.0.1:5000';

  constructor(private http: HttpClient) {}

  public query<T>(stateParams: HttpParams): Observable<T> {
    const params = Object.entries(this.baseParams())
    .filter(
      ([key, val]) => !stateParams.get(key)
    )
    .reduce(
      (queryParams, [key, val]) => queryParams.append(key, `${val}`)
      , stateParams
    );

    const responseType: any = params.get('output') === 'jsonlite' ?
      'json' : 'text';

    const queryParamsStr = params.toString()
      .replace('+', '%2B');

    return this.http.get<T>(`${this.testUrl}/services/search/param?${queryParamsStr}`, {
      responseType
    });
  }

  public upload(files): Observable<any> {
    const formData: FormData = new FormData();
    files.forEach(file => {
      formData.append('files', file, file.name);
    });

    return this.http.post(`${this.testUrl}/services/convert/files_to_wkt`, formData);
  }

  public validate(wkt: string): Observable<any> {
    const params = new HttpParams()
    .append('wkt', wkt);

    return this.http.get<PolygonValidateResponse>(
      `${this.testUrl}/services/validate/wkt`, { params }
    );
  }

  private dummyData(): Observable<any[]>  {
    return this.http.get<any[]>('assets/sample-data/sentinel-1a.json');
  }

  private baseParams() {
    return {
      output: 'jsonlite'
    };
  }
}
