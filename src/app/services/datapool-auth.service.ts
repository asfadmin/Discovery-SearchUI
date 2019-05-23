import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { ViewType } from '@models';

import { interval, Subject, Subscription } from 'rxjs';
import { map, takeUntil, tap, delay, take } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DatapoolAuthService {

  // FIXME: When the dev/test/prod sites have asf links this can be enabled
  private authUrl = false /* environment.production */ ?
    'https://auth-dev-0.asf.alaska.edu' :
    'https://auth-dev-0.asf.alaska.edu';

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
    ).subscribe(_ => {
      try {
        if (loginWindow.location.host === window.location.host) {
          loginWindow.close();
          this.checkLogin();
          console.log(this.loadCookies());
          loginDone.next();
        }
      } catch (e) {
      }
    }
    );
  }

  public logout(): void {
    this.http.get(
      `${this.authUrl}/loginservice/logout`, {
        responseType: 'text',
        withCredentials: true
      }).subscribe(resp => {
        console.log(resp);
        this.checkLogin();
      });
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
