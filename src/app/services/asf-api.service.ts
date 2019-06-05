import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, Subject } from 'rxjs';

import { PolygonValidateResponse, MissionPlatform } from '@models';
import * as services from '@services';

@Injectable({
  providedIn: 'root'
})
export class AsfApiService {

  constructor(
    private env: services.EnvironmentService,
    private http: HttpClient
  ) {}

  public get apiUrls() {
    return this.env.value.api;
  }

  public get apiUrl() {
    return this.env.value.api.prod;
  }

  public setApiUrl(url: string): void {
    this.apiUrl = url;
  }

  public health(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`);
  }

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

    return this.http.get<T>(`${this.apiUrl}/services/search/param?${queryParamsStr}`, {
      responseType
    });
  }

  public missionSearch(platform: MissionPlatform): Observable<{result: string[]}> {
    const params = new HttpParams()
      .append('platform', platform);

    const url = `${this.apiUrl}/services/utils/mission_list`;

    return this.http.get<{result: string[]}>(url, { params });
  }

  public upload(files): Observable<any> {
    const formData: FormData = new FormData();
    files.forEach(file => {
      formData.append('files', file, file.name);
    });

    return this.http.post(`${this.apiUrl}/services/utils/files_to_wkt`, formData);
  }

  public validate(wkt: string): Observable<any> {
    const params = new HttpParams()
      .append('wkt', wkt);

    const url = `${this.apiUrl}/services/utils/wkt`;

    const paramsStr = params.toString();

    const formData: FormData = new FormData();
    formData.append('wkt', params.get('wkt'));

    return (!this.isUrlToLong(url, paramsStr)) ?
      this.http.get(url, { params }) :
      this.http.post(url, formData);
  }

  private isUrlToLong(url: string, params: string): boolean {
    const max_url_length = 1500;

    return (url.length + params.length) > max_url_length;
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
