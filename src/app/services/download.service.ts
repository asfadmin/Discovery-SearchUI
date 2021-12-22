import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { download, Download } from './download';
import { Observable } from 'rxjs';
import { SAVER, Saver } from '@services/saver.provider';

import { Store } from '@ngrx/store';
import { AppState } from '@store';

import * as userStore from '@store/user';
import { SubSink } from 'subsink';
import { AuthService } from './auth.service';

@Injectable({providedIn: 'root'})
export class DownloadService {

  public isUserLoggedIn: boolean;
  private subs = new SubSink();

  constructor(
    private http: HttpClient,
    @Inject(SAVER) private save: Saver,
    private store$: Store<AppState>,
    private Auth: AuthService
    ) {
      this.subs.add(
        this.store$.select(userStore.getIsUserLoggedIn).subscribe(
          isLoggedIn => this.isUserLoggedIn = isLoggedIn
        )
      );
    }

  classicResp: Observable<Download>;

  download(url: string, filename: string): Observable<Download> {
    if (!this.isUserLoggedIn) {
      this.Auth.login$().toPromise().then(() => {
        return this.downloadInternal(url, filename);
      });
    } else {
      return this.downloadInternal(url, filename);
    }
  }
  private downloadInternal(url: string, filename: string): Observable<Download> {
    const resp = this.http.get(url, {
      withCredentials: !(new URL(url).origin.startsWith('hyp3')),
      reportProgress: true,
      observe: 'events',
      responseType: 'blob',
    });


    return resp.pipe(download(filename, blob => this.save(blob, url, filename)));
  }



  // blob(url: string, filename?: string): Observable<Blob> {
  blob(url: string): Observable<Blob> {
    console.log('download.service.ts blog() url:', url);
    return this.http.get(url, {
      withCredentials: !(new URL(url).origin.startsWith('hyp3')),
      responseType: 'blob',
    });
  }
}

