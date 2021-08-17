import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { download, Download } from './download';
import { Observable } from 'rxjs';
import { SAVER, Saver } from '@services/saver.provider';

@Injectable({providedIn: 'root'})
export class DownloadService {

  wCreds = true;

  constructor(
    private http: HttpClient,
    @Inject(SAVER) private save: Saver
  ) {}

  classicResp: Observable<Download>;

  download(url: string, filename: string): Observable<Download> {
    // tslint:disable-next-line:max-line-length
    return this.http.get(url, {
      withCredentials: this.wCreds,
      reportProgress: true,
      observe: 'events',
      responseType: 'blob',
    }).pipe(download(filename, blob => this.save(blob, url, filename)));
  }

  // blob(url: string, filename?: string): Observable<Blob> {
  blob(url: string): Observable<Blob> {
    return this.http.get(url, {
      withCredentials: this.wCreds,
      responseType: 'blob',
    });
  }
}

