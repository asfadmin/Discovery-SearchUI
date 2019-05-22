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
  private loginProcess: Subscription;

  constructor(private http: HttpClient) { }

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
          this.isLoggedIn = true;
          console.log(this.listCookies());
          loginDone.next();
        }
      } catch (e) {
      }
    }
    );
  }

  public logout(): void {
    this.http.get(`${this.authUrl}/loginservice/logout`, {
      withCredentials: true
    }).subscribe(resp => console.log(resp));
  }

  private listCookies(): string {
    const theCookies = document.cookie.split(';');
    let aString = '';

    for (let i = 1 ; i <= theCookies.length; i++) {
        aString += i + ', value: ' + theCookies[i - 1] + '\n';
    }

    return aString;
  }
}
