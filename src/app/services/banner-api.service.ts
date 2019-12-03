import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { EnvironmentService } from './environment.service';
import { Banner, BannerApiResponse } from '@models';

@Injectable({
  providedIn: 'root'
})
export class BannerApiService {
  constructor(
    private env: EnvironmentService,
    private http: HttpClient
  ) { }

  public load(): Observable<BannerApiResponse> {
    return this.http.get<any[]>(this.bannerUrl()).pipe(
      map(banners => ({
        banners: <any[]>banners.map(banner => ({
          text: banner.text || banner.name,
          type: '',
          target: ''
        })),
        systime: ''
      })
    ));
  }

  private bannerUrl(): string {
    const deployment = this.env.value.devMode ? 'test' : 'prod';

    return `https://banners.asf.alaska.edu/calendar/${deployment}`;
  }
}
