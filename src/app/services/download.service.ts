import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { download, Download } from './download';
import { Observable } from 'rxjs';
import { SAVER, Saver } from '@services/saver.provider';

@Injectable({providedIn: 'root'})
export class DownloadService {

  wCreds = false;

  constructor(
    private http: HttpClient,
    @Inject(SAVER) private save: Saver
  ) {}

  download(url: string, filename: string): Observable<Download> {
    // tslint:disable-next-line:max-line-length
    const megas = window.prompt('How many MBs do you want:');
    url = 'https://filegen-dev.asf.alaska.edu/generate?bytes=' + megas.trim() + 'e6';
    // url = 'https://images.unsplash.com/photo-1619921845646-6216752a036c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3168&q=80';
    // filename = 'earth.jpg';
    // url = 'https://grfn-test.asf.alaska.edu/door/download/S1-GUNW-A-R-014-tops-20200513_20200419-153046-28315N_26591N-PP-e3ef-v2_0_3.nc';
    // filename = 'grfn-test.asf.alaska.edu/door/download/S1-GUNW-A-R-014-tops-20200513_20200419-153046-28315N_26591N-PP-e3ef-v2_0_3.nc';
    // url = 'https://grfn-test.asf.alaska.edu/door/browse/S1-GUNW-A-R-004-tops-20150825_20150310-230613-37822N_35782N-PP-43bb-v2_0_4.png';
    // filename = 'S1-GUNW-A-R-004-tops-20150825_20150310-230613-37822N_35782N-PP-43bb-v2_0_4.png';
    console.log('Calling http.get');
    console.log('url:', url);
    console.log('filename:', filename);
    return this.http.get(url, {
      withCredentials: this.wCreds,
      reportProgress: true,
      observe: 'events',
      responseType: 'blob'
    }).pipe(download(filename, blob => this.save(blob, filename)));
  }


  // blob(url: string, filename?: string): Observable<Blob> {
  blob(url: string): Observable<Blob> {
    return this.http.get(url, {
      withCredentials: this.wCreds,
      responseType: 'blob'
    });
  }
}
