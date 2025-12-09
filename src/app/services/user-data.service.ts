import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  public getUserInfo$(userAuth: UserAuth): Observable<UserInfo> {
    const url = this.getUserInfoURL(this.baseUrl);
    const headers = this.makeAuthHeader(userAuth.token);
    return this.http
      .get<UserInfo>(url, {
        headers,
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
    const headers = this.makeAuthHeader(userAuth.token);

    return this.http
      .get<T>(url, {
        headers,
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
    const headers = this.makeAuthHeader(userAuth.token);

    return this.http
      .post(url, value, {
        headers,
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

  private makeAuthHeader(token: string): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  private getBaseUrlFrom(): string {
    return this.env.currentEnv.user_data;
  }
  public getUserInfoURL(baseUrl: string): string {
    return `${baseUrl}/info/`;
  }
}
