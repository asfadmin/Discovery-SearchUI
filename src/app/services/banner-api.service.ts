import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable, of, combineLatest } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { EnvironmentService } from './environment.service';
import { BannerApiResponse } from '@models';

@Injectable({
  providedIn: 'root'
})
export class BannerApiService {
  constructor(
    private snackBar: MatSnackBar,
    private env: EnvironmentService,
    private http: HttpClient
  ) { }

  public load(): Observable<BannerApiResponse> {
    const calendars = ['error', 'outages', 'news'];

    if (this.env.maturity === 'test') {
      calendars.push('test');
    }

    return combineLatest(
      ...calendars.map(calendar => this.loadBanners(calendar))
    ).pipe(
      map(bannerTypes => ({
        banners: bannerTypes.reduce(
          (banners, bannerType) => [...banners, ...bannerType.banners], []
        ),
        systime: '',
      }))
    );
  }

  private loadBanners(calendar: string) {
    const url = `${this.bannerUrl()}/calendar/${calendar}`;

    return this.http.get<any[]>(url).pipe(
          map(banners => ({
            banners: <any[]>banners.map(banner => ({
              text: banner.text,
              name: banner.name,
              type: calendar
            })),
            systime: ''
          }),
            catchError(_ => {
              this.snackBar.open('Trouble loading notifications', 'ERROR', {
                duration: 5000
              });

              return of(null);
            }
          )
        ));
  }

  private bannerUrl(): string {
    return this.env.currentEnv.banner;
  }
}
