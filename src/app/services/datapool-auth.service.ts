import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { ViewType } from '@models';

import { interval, Subject, Subscription, Observable } from 'rxjs';
import { map, takeUntil, tap, delay, take, filter, switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DatapoolAuthService {

  private authUrl = 'https://auth-test-jnk.asf.alaska.edu';
  private earthdataUrl = 'https://urs.earthdata.nasa.gov';

  public isLoggedIn = false;
  public user = {
    id: null,
    accessToken: null
  };

  private loginProcess: Subscription;

  constructor(private http: HttpClient) {
    this.checkLogin();
  }

  public login() {
    const localUrl = window.location.origin;

    const appRedirect = encodeURIComponent(`${localUrl}?uiView=${ViewType.LOGIN}`);

    const url = `${this.authUrl}/loginservice/in/${appRedirect}`;

    const loginWindow = window.open(
      url,
      'Vertex: URS Earth Data Authorization',
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

  private loadUserData(): Observable<any> {
    const profileUrl = `${this.earthdataUrl}/api/users/${this.user.id}`;
    const headers = new HttpHeaders()
      .append('Authorization', `Bearer ${this.user.accessToken}`);

    return this.http.get(profileUrl, { headers });
  }

  private checkLogin() {
    const cookies = this.loadCookies();
    this.user = {
      id: cookies['urs-user-id'],
      accessToken: cookies['urs-access-token']
    };

    this.isLoggedIn = !!(this.user.id && this.user.accessToken);
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
