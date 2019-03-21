import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ViewType } from '@models';

import { interval, Subject, Subscription } from 'rxjs';
import { map, takeUntil, tap, delay, take } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DatapoolAuthService {

  // FIXME: When the dev/test/prod sites have asf links this can be enabled
  private vertexAuthUrl = false /* environment.production */ ?
    'https://vertex.daac.asf.alaska.edu' :
    'https://vertex-dev.asf.alaska.edu';

  public isLoggedIn = false;
  private loginProcess: Subscription;

  constructor(private http: HttpClient) { }

  public login() {
    const localUrl = window.location.origin;

    const appRedirect = `${localUrl}?uiView=${ViewType.LOGIN}`;

    const url = 'https://urs.earthdata.nasa.gov/oauth/authorize' +
      '?client_id=BO_n7nTIlMljdvU6kRRB3g&response_type=code' +
      `&redirect_uri=${this.vertexAuthUrl}/services/urs4_token_request` +
      `&state=${appRedirect}`;

    console.log(url);
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
          loginDone.next();
        }
      } catch (e) {
      }
    }
    );
  }

  public profileInfo() {
    return this.http.get(`${this.vertexAuthUrl}/services/profile_info`, {
      withCredentials: true
    });
  }
}
