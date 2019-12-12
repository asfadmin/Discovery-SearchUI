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

  public user$ = new BehaviorSubject<models.UserAuth>({
    id: null,
    token: null
  });

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
    const token = cookies['asf-urs'];

    if (!token) {
      this.setUser(null, null);
      return;
    }

    const user = jwt_decode(token);

    if (Date.now() > user.exp * 1000) {
      this.setUser(null, null);
      return;
    }

    this.setUser(user['urs-user-id'], token);
  }

  private setUser(id: string | null, token: string | null): void {
    this.user$.next({ id, token });
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
