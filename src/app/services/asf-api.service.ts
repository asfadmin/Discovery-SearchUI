import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  MissionDataset, Props, apiParamNames,
  on_demand_prod_collections, on_demand_test_collections, on_demand_test_collections_asfdev
} from '@models';
import { EnvironmentService } from './environment.service';
import { PropertyService } from './property.service';

@Injectable({
  providedIn: 'root'
})
export class AsfApiService {
  constructor(
    private env: EnvironmentService,
    private prop: PropertyService,
    private http: HttpClient
  ) {}

  public get apiUrl() {
    return this.env.currentEnv.api;
  }

  public health(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`);
  }

  public collections() {
    let collections: String[] = []

    // In case we wanted to limit searched collections further, limit it based on envionment
    // let provider = this.environmentService.currentEnv.cmr_provider
    // let maturity = this.environmentService.maturity

    // if (maturity === 'prod') {
    collections = on_demand_prod_collections

    // } else if(provider === 'ASF') {
    collections.push(...on_demand_test_collections)

    // } else {
    collections.push(...on_demand_test_collections_asfdev)
    // }
    return collections;
  }

  public query<T>(stateParamsObj: {[paramName: string]: string | number | null}): Observable<T> {
    const useProdApi = +stateParamsObj['maxResults'] >= 5000;

    if (!this.env.isProd) {
      if (!useProdApi) {
        stateParamsObj['maturity'] = this.env.currentEnv.api_maturity;
      }

      if (this.env.currentEnv.cmr_provider) {
        stateParamsObj['cmr_provider'] = this.env.currentEnv.cmr_provider;
      }

      if (this.env.currentEnv.cmr_token) {
        stateParamsObj['cmr_token'] = this.env.currentEnv.cmr_token;
      }
    }

    const params = this.queryParamsFrom(stateParamsObj);

    const queryParamsStr = params.toString()
    .replace(/\+/g, '%2B');

    const endpoint = params.get('reference') ?
    this.baselineEndpoint() :
    this.searchEndpoint({ useProdApi });

    const formData = this.toFormData(params);

    const responseType: any = params.get('output') === 'jsonlite2' ?
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
      .replace(/\+/g, '%2B');

    return `${endpoint}?${queryParamsStr}`;
  }

  private searchEndpoint(options?: { useProdApi: boolean }): string {
    const prodUrl = 'https://api.daac.asf.alaska.edu';

    const url = options && options.useProdApi ? prodUrl : this.apiUrl;

    return `${url}/services/search/param`;
  }

  private baselineEndpoint(): string {
    return `${this.apiUrl}/services/search/baseline`;
  }

  private queryParamsFrom(stateParamsObj) {
    const relevant = this.onlyRelevantParams(stateParamsObj);

    const stateParams = this.toHttpParams(relevant);

    const params = Object.entries(this.baseParams())
      .filter(
        ([key, _]) => !stateParams.get(key)
      )
      .reduce(
        (queryParams, [key, val]) => queryParams.append(key, `${val}`)
        , stateParams
      );

    return params;
  }

  private toHttpParams(paramsObj): HttpParams {
    return Object.entries(paramsObj)
      .filter(([_, val]) => !!val)
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
        ([property, _]) => !this.prop.isRelevant(<Props>property)
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

  public loadMissions$ = combineLatest([
      this.missionSearch(MissionDataset.S1_BETA).pipe(
        map(resp => ({[MissionDataset.S1_BETA]: resp.result}))
      ),
      this.missionSearch(MissionDataset.AIRSAR).pipe(
        map(resp => ({[MissionDataset.AIRSAR]: resp.result}))
      ),
      this.missionSearch(MissionDataset.UAVSAR).pipe(
        map(resp => ({[MissionDataset.UAVSAR]: resp.result}))
      )]
    ).pipe(
      map(missions => missions.reduce(
        (allMissions, mission) => ({ ...allMissions, ...mission }),
        {}
      )
      )
    );

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

  private baseParams() {
    return {
      output: 'jsonlite2'
    };
  }
}
