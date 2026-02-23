import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { interval, Subject, Observable, of } from 'rxjs';
import {
  map,
  takeUntil,
  take,
  catchError,
  filter,
  switchMap,
  retry,
} from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '@store';

import { EnvironmentService } from './environment.service';
import * as userStore from '@store/user';

import * as models from '@models';
import { NotificationService } from './notification.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private env = inject(EnvironmentService);
  private http = inject(HttpClient);
  private notificationService = inject(NotificationService);
  private store$ = inject<Store<AppState>>(Store);
  private translateService = inject(TranslateService);
  private existingUserInfo: models.UserAuth = null;

  private bc: BroadcastChannel;
  constructor() {
    if (typeof BroadcastChannel !== 'undefined') {
      this.bc = new BroadcastChannel('asf-vertex');
      this.bc.onmessage = (_event: MessageEvent) => {
        this.getUser()
          .pipe(
            take(1),
            map((user) => {
              if (!user?.id) {
                this.store$.dispatch(new userStore.Logout());
              } else {
                this.store$.dispatch(new userStore.Login(user));
              }
            }),
          )
          .subscribe();
      };
    }
  }
  public get authUrl() {
    return this.env.currentEnv.auth;
  }

  public get earthdataUrl() {
    return this.env.currentEnv.urs;
  }

  public get ursClientId() {
    return this.env.currentEnv.urs_client_id;
  }

  public login$(): Observable<models.UserAuth | null> {
    const localUrl = window.location.origin;

    const appRedirect = encodeURIComponent(localUrl);

    const redirect = `${this.authUrl}/login&state=${appRedirect}`;
    const clientId = this.ursClientId;

    const url = `${this.earthdataUrl}/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirect};`;

    const loginWindow = window.open(
      url,
      'SAR Search: URS Earth Data Authorization',
      'scrollbars=yes, width=600, height= 600',
    );

    const loginWindowClosed = new Subject<void>();
    return interval(500).pipe(
      takeUntil(loginWindowClosed),
      switchMap((_) => {
        if (loginWindow.closed) {
          loginWindowClosed.next();
          return this.getUser();
        }
        try {
          if (loginWindow.location.host === window.location.host) {
            loginWindow.close();
            this.bc.postMessage({
              event: 'login',
            });
            return this.getUser();
          }
        } catch (_e) {
          // Do nothing
        }
        return of(null);
      }),
      catchError((_) => {
        this.notificationService.error(
          this.translateService.instant('TROUBLE_LOGGING_IN'),
          this.translateService.instant('ERROR'),
          { timeOut: 5000 },
        );
        loginWindowClosed.next();
        return of(null);
      }),
      filter((user) => !!user),
      take(1),
    );
  }

  public logout$(): Observable<models.UserAuth> {
    return this.http
      .get(`${this.authUrl}/logout`, {
        responseType: 'text',
        withCredentials: true,
      })
      .pipe(
        map((_) => {
          this.bc.postMessage({
            event: 'logout',
          });
          return this.existingUserInfo;
        }),
        catchError((_) => {
          this.notificationService.error(
            this.translateService.instant('TROUBLE_LOGGING_OUT'),
            this.translateService.instant('ERROR'),
            { timeOut: 5000 },
          );
          return this.getUser();
        }),
        take(1),
      );
  }

  public getUser(): Observable<models.UserAuth | null> {
    return this.http
      .get<models.UserAuth>(`${this.env.currentEnv.user_data}/info/cookie`, {
        withCredentials: true,
      })
      .pipe(
        retry({
          count: 3,
          delay: 100,
        }),
        map((user) => {
          return this.makeUser(
            user['urs-user-id'],
            user['urs-groups'],
            user['urs-access-token'],
            user['exp'],
          );
        }),
        map((final) => {
          this.existingUserInfo = final;
          setTimeout(
            () => {
              this.store$.dispatch(new userStore.Logout());
              this.notificationService.info(
                'Session Expired',
                'Please login again',
              );
            },
            final.exp * 1000 - Date.now(),
          );
          return final;
        }),
        catchError((_error) => {
          console.error('Failed to get user info');
          return of(null);
        }),
        take(1),
      );
  }

  private makeUser(
    id: string,
    groups: models.URSGroup[],
    token: string,
    exp: number,
  ): models.UserAuth {
    return { id, token, groups, exp };
  }
}
