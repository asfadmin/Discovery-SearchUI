import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { download, Download } from './download';
import { Observable } from 'rxjs';
import { SAVER, Saver } from '@services/saver.provider';


@Injectable({providedIn: 'root'})
export class DownloadService {



  constructor(
    private http: HttpClient,
    @Inject(SAVER) private save: Saver,
    ) {    }

  classicResp: Observable<Download>;

  download(url: string, filename: string): Observable<Download> {

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

