import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { MissionDataset, Props, apiParamNames } from '@models';
import { EnvironmentService } from './environment.service';
import { PropertyService } from './property.service';

@Injectable({
  providedIn: 'root'
})
export class AsfApiService {

  private maturity = 'prod';

  constructor(
    private env: EnvironmentService,
    private prop: PropertyService,
    private http: HttpClient
  ) {}

  public get apiUrls() {
    return this.env.value.api;
  }

  public get apiUrl() {
    return this.env.value.api[this.maturity];
  }

  public setApiMaturity(maturity: string): void {
    this.maturity = maturity;
  }

  public health(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`);
  }

  public query<T>(stateParamsObj: {[paramName: string]: string | null}): Observable<T> {
    const params = this.queryParamsFrom(stateParamsObj);

    const queryParamsStr = params.toString()
      .replace('+', '%2B');

    const endpoint = this.searchEndpoint();
    const formData = this.toFormData(params);

    const responseType: any = params.get('output') === 'jsonlite' ?
      'json' : 'text';

    return !this.isUrlToLong(endpoint, queryParamsStr) ?
      this.http.get<T>(
        `${endpoint}?${queryParamsStr}`, { responseType }
      ) :
      this.http.post<T>(
        endpoint, formData, { responseType }
      );
  }

  public queryUrlFrom(stateParamsObj, options?: {apiUrl: string}) {
    const params = this.queryParamsFrom(stateParamsObj);

    const endpoint = (options) ?
      `${options.apiUrl}/services/search/param` :
       this.searchEndpoint();

    const queryParamsStr = params.toString()
      .replace('+', '%2B');

    return `${endpoint}?${queryParamsStr}`;
  }

  private searchEndpoint(): string {
    return `${this.apiUrl}/services/search/param`;
  }

  private queryParamsFrom(stateParamsObj) {
    const relevant = this.onlyRelevantParams(stateParamsObj);

    const stateParams = this.toHttpParams(relevant);

    const params = Object.entries(this.baseParams())
    .filter(
      ([key, val]) => !stateParams.get(key)
    )
    .reduce(
      (queryParams, [key, val]) => queryParams.append(key, `${val}`)
      , stateParams
    );

    return params;
  }

  private toHttpParams(paramsObj): HttpParams {
    return Object.entries(paramsObj)
    .filter(([param, val]) => !!val)
    .reduce(
      (queryParams, [param, val]) => queryParams.set(param, <string>val),
      new HttpParams()
    );
  }

  private toFormData(params: HttpParams): FormData {
    const formData = new FormData();

    params.keys().forEach(
      key => formData.append(key, params.get(key))
    );

    return formData;
  }

  private onlyRelevantParams(paramsObj): {[id: string]: string | null} {
  const irrelevant = Object.entries(apiParamNames)
      .filter(
        ([property, apiName]) => !this.prop.isRelevant(<Props>property)
      )
      .map(([_, apiName]) => apiName);

  const filteredParams = Object.keys(paramsObj)
    .filter(key => !irrelevant.includes(key))
    .reduce((filtered, key) => {
      filtered[key] = paramsObj[key];
      return filtered;
    }, {});

    return filteredParams;
  }

  public missionSearch(dataset: MissionDataset): Observable<{result: string[]}> {
    const params = new HttpParams()
      .append('platform', dataset);

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
