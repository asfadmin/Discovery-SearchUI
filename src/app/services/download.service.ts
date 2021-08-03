import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { download, Download } from './download';
import { Observable } from 'rxjs';
import { SAVER, Saver } from '@services/saver.provider';
import { UAParser } from 'ua-parser-js';

@Injectable({providedIn: 'root'})
export class DownloadService {

  wCreds = true;

  constructor(
    private http: HttpClient,
    @Inject(SAVER) private save: Saver
  ) {}

  download(url: string, filename: string): Observable<Download> {

    // UAParser.js - https://www.npmjs.com/package/ua-parser-js
    // JavaScript library to detect Browser, Engine, OS, CPU, and Device type/model from User-Agent data with relatively small footprint
    const parser = new UAParser();
    const userAgent = parser.getResult();
    // console.log(userAgent.browser);             // {name: "Chromium", version: "15.0.874.106"}
    // console.log(userAgent.device);              // {model: undefined, type: undefined, vendor: undefined}
    // console.log(userAgent.os);                  // {name: "Ubuntu", version: "11.10"}
    // console.log(userAgent.os.version);          // "11.10"
    // console.log(userAgent.engine.name);         // "WebKit"
    // console.log(userAgent.cpu.architecture);    // "amd64"

    // const megas = window.prompt('How many MBs do you want:');
    // url = 'https://filegen-dev.asf.alaska.edu/generate?bytes=' + megas.trim() + 'e6';
    // url = 'https://filegen-dev.asf.alaska.edu/generate?bytes=10e6';

    console.log('Download Service Executing');
    console.log('url:', url);
    console.log('filename:', filename);

    if (userAgent.browser.name !== 'Chrome') {
      // classicDownload( url, filename );
      // return;
    }

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

export function classicDownload( url, _filename ) {
  console.log('classicDownload url:', url);
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;
  // link.pathname = _filename;
  link.target = '_blank';
  link.type = 'blob';

  // It needs to be added to the DOM so it can be clicked
  document.body.appendChild(link);
  link.click();

  // To make this work on Firefox we need to wait
  // a little while before removing it.
  setTimeout(() => {
    URL.revokeObjectURL(link.href);
    link.parentNode.removeChild(link);
    console.log('link removed');
  }, 0);
}
