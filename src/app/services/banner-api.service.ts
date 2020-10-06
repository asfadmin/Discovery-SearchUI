import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable, of } from 'rxjs';
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
    return this.http.get<any[]>(this.bannerUrl()).pipe(
      map(banners => ({
        banners: <any[]>banners.map(banner => ({
          text: banner.text || banner.name,
          type: '',
          target: ''
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
