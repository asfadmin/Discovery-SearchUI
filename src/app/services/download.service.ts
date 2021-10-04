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
    console.log('download.service.ts download() filename:', filename);
    // tslint:disable-next-line:max-line-length
    const resp = this.http.get(url, {
      withCredentials: this.wCreds,
      reportProgress: true,
      observe: 'events',
      responseType: 'blob',
    });

    console.log('download.service.ts download() resp:', resp);
    console.log('download.service.ts download() response filename:', this.getFileNameFromHttpResponse(resp));

    // const headers = resp.headers;
    // console.log(headers);
    // const contentDisposition = headers.get('content-disposition');

    return resp.pipe(download(filename, blob => this.save(blob, url, filename)));
  }

  getFileNameFromHttpResponse(httpResponse) {
    const contentDispositionHeader = httpResponse.getHeader('Content-Disposition');
    const result = contentDispositionHeader.split(';')[1].trim().split('=')[1];
    return result.replace(/"/g, '');
  }

  // blob(url: string, filename?: string): Observable<Blob> {
  blob(url: string): Observable<Blob> {
    console.log('download.service.ts blog() url:', url);
    return this.http.get(url, {
      withCredentials: this.wCreds,
      responseType: 'blob',
    });
  }
}

