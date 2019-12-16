import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { ViewType } from '@models';

import { interval, Subject, BehaviorSubject, Subscription, Observable } from 'rxjs';
import { map, takeUntil, tap, delay, take, filter, switchMap } from 'rxjs/operators';

import { EnvironmentService } from './environment.service';
import * as jwt_decode from 'jwt-decode';

import * as models from '@models';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = this.env.value.auth.api;
  private earthdataUrl = this.env.value.auth.urs;

  constructor(
    private env: EnvironmentService,
    private http: HttpClient
  ) {}

  public login$(): Observable<models.UserAuth | null> {
    const localUrl = window.location.origin;

    const appRedirect = encodeURIComponent(localUrl);

    const ursUrl = `https://urs.earthdata.nasa.gov/oauth/authorize`;
    const redirect = `${this.authUrl}/login&state=${appRedirect}`;

    const url = `${ursUrl}?response_type=code&client_id=BO_n7nTIlMljdvU6kRRB3g&redirect_uri=${redirect};`;

    const loginWindow = window.open(
      url,
      'SAR Search: URS Earth Data Authorization',
      'scrollbars=yes, width=600, height= 600'
    );

    const loginWindowClosed = new Subject();

    return interval(500).pipe(
      takeUntil(loginWindowClosed),
      map(_ => {
        let user = null;

        if (loginWindow.closed) {
          loginWindowClosed.next();
        }

        try {
          if (loginWindow.location.host === window.location.host) {
            loginWindow.close();
            user = this.getUser();
          }
        } catch (e) {
        }

        return user;
      }),
      filter(user => !!user),
      take(1)
    );
  }

  public logout$(): Observable<models.UserAuth>  {
    return this.http.get(
      `${this.authUrl}/loginservice/logout`, {
        responseType: 'text',
        withCredentials: true
      }).pipe(
        map(resp => this.getUser()),
        take(1)
      );
  }

  public getUser(): models.UserAuth {
    const cookies = this.loadCookies();
    const token = cookies['asf-urs'];

    if (!token) {
      return this.makeUser(null, null);
    }

    const user = jwt_decode(token);

    if (this.isExpired(user)) {
      return this.makeUser(null, null);
    }

    return this.makeUser(user['urs-user-id'], token);
  }

  private makeUser(id: string | null, token: string | null): models.UserAuth {
    return { id, token };
  }

  private isExpired(userToken): boolean {
    return Date.now() > userToken.exp * 1000;
  }

  private loadCookies() {
    return document.cookie.split(';')
      .map(s => s.trim().split('='))
      .map(([name, val]) => ({[name]: val}))
      .reduce(
        (allCookies, cookie) => ({ ...allCookies, ...cookie })
      );
  }
}
