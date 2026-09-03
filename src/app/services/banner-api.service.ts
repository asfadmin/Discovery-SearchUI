import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of, combineLatest } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { BannerApiResponse } from '@models';

import { EnvironmentService } from './environment.service';
// import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class BannerApiService {
  private env = inject(EnvironmentService);
  private http = inject(HttpClient);

  public load(): Observable<BannerApiResponse> {
    const calendars = ['error', 'outages', 'news'];

    if (!this.env.isProd) {
      calendars.push('test');
    }

    return combineLatest(
      ...calendars.map((calendar) => this.loadBanners(calendar)),
    ).pipe(
      map((bannerTypes) => ({
        banners: bannerTypes.reduce(
          (banners, bannerType) => [...banners, ...bannerType.banners],
          [],
        ),
        systime: '',
      })),
    );
  }

  private loadBanners(calendar: string) {
    const url = `${this.bannerUrl()}/calendar/${calendar}`;

    return this.http.get<any[]>(url).pipe(
      map(
        (banners) => ({
          banners: banners.map((banner) => ({
            id: banner.id,
            text: banner.text,
            name: banner.name,
            type: calendar,
          })) as any[],
          systime: '',
        }),
        catchError((_) => {
          // this.notificationService.error('Trouble loading notifications', 'Error', {
          //   timeOut: 5000
          // });

          return of(null);
        }),
      ),
    );
  }

  private bannerUrl(): string {
    return this.env.currentEnv.banner;
  }
}
