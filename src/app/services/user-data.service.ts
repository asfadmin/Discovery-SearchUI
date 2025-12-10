import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { EnvironmentService } from './environment.service';
import { UserAuth } from '@models';
import { NotificationService } from './notification.service';

interface UserInfo {
  uid: string;
  first_name: string;
  last_name: string;
  country: string;
  email_address: string;
  organization: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  private env = inject(EnvironmentService);
  private http = inject(HttpClient);
  private notificationService = inject(NotificationService);

  private baseUrl = this.getBaseUrlFrom();

  public getUserInfo$(_userAuth: UserAuth): Observable<UserInfo> {
    const url = this.getUserInfoURL(this.baseUrl);
    return this.http
      .get<UserInfo>(url, {
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          if (error.status === 404) {
            return of(null);
          }

          this.notificationService.error(
            'Trouble loading profile information',
            'Error',
            {
              timeOut: 5000,
            },
          );

          return of(null);
        }),
      );
  }

  public getAttribute$<T>(
    userAuth: UserAuth,
    attribute: string,
  ): Observable<T> {
    const url = this.makeEndpoint(this.baseUrl, userAuth.id, attribute);

    return this.http
      .get<T>(url, {
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          if (error.status === 404) {
            return of(null);
          }

          this.notificationService.error(
            'Trouble loading profile information',
            'Error',
            {
              timeOut: 5000,
            },
          );

          return of(null);
        }),
      );
  }

  public setAttribute$<T>(
    userAuth: UserAuth,
    attribute: string,
    value: T,
  ): Observable<any> {
    const url = this.makeEndpoint(this.baseUrl, userAuth.id, attribute);

    return this.http
      .post(url, value, {
        withCredentials: true,
      })
      .pipe(
        catchError((_) => {
          this.notificationService.error(
            'Trouble setting profile information',
            'Error',
            {
              timeOut: 5000,
            },
          );

          return of(null);
        }),
      );
  }

  private makeEndpoint(
    baseUrl: string,
    userId: string,
    attributeName: string,
  ): string {
    return `${baseUrl}/vertex/${userId}/${attributeName}`;
  }

  private getBaseUrlFrom(): string {
    return this.env.currentEnv.user_data;
  }
  public getUserInfoURL(baseUrl: string): string {
    return `${baseUrl}/info/`;
  }
}
