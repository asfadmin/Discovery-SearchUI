import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { ViewType } from '@models';

import { interval, Subject, Subscription, Observable } from 'rxjs';
import { map, takeUntil, tap, delay, take, filter, switchMap } from 'rxjs/operators';

import { EnvironmentService } from './environment.service';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = this.env.value.auth.api;
  private earthdataUrl = this.env.value.auth.urs;

  public isLoggedIn = false;
  public user = {
    id: null
  };

  private loginProcess: Subscription;

  constructor(
    private env: EnvironmentService,
    private http: HttpClient
  ) {
    this.checkLogin();
  }

  public login() {
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

    const loginDone = new Subject();

    if (this.loginProcess) {
      this.loginProcess.unsubscribe();
    }

    this.loginProcess = interval(500).pipe(
      take(50),
      takeUntil(loginDone),
      tap(_ => {
        try {
          if (loginWindow.location.host === window.location.host) {
            loginWindow.close();
            this.checkLogin();
            loginDone.next();
          }
        } catch (e) {
        }
      }),
      filter(_ => !this.isLoggedIn),
    ).subscribe(_ => _);
  }

  public logout(): void {
    this.http.get(
      `${this.authUrl}/loginservice/logout`, {
        responseType: 'text',
        withCredentials: true
      }).subscribe(resp => {
        this.checkLogin();
      });
  }

  private checkLogin() {
    const cookies = this.loadCookies();

    if (!cookies['asf-urs']) {
      return;
    }

    const auth_cookie = jwt_decode(cookies['asf-urs']);

    this.user = {
      id: auth_cookie['urs-user-id'],
    };

    this.isLoggedIn = !!this.user.id;
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
