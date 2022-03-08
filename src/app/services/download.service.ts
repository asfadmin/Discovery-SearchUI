import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SAVER, Saver } from '@services/saver.provider';
import { DownloadStatus } from '@models/download.model';

import { HttpEvent, HttpEventType } from '@angular/common/http';
import { distinctUntilChanged, scan } from 'rxjs/operators';
import { CMRProduct } from '@models';

@Injectable({ providedIn: 'root' })
export class DownloadService {
  public dir;
  constructor(
    private http: HttpClient,
    @Inject(SAVER) private save: Saver,
  ) { }

  classicResp: Observable<DownloadStatus>;

  download(url: string, filename: string, product: CMRProduct,  id): Observable<DownloadStatus> {

    const resp = this.http.get(url, {
      withCredentials: !(new URL(url).origin.startsWith('hyp3')),
      reportProgress: true,
      observe: 'events',
      responseType: 'blob',
    });
    if(!this.dir) {
      /* @ts-ignore:disable-next-line */
      window.showDirectoryPicker().then(dir => { 
        this.dir = dir;
        dir.requestPermission({mode: 'readwrite'})
      });
    } 
    return resp.pipe(this.download$(filename, id, product, (blob, dir) => this.save(blob, url, filename, dir)));

  }

  private download$(
    filename: string,
    id: string,
    product: CMRProduct,
    saver?: (b: Blob, w: any) => void): (source: Observable<HttpEvent<Blob>>) => Observable<DownloadStatus> {


    return (source: Observable<HttpEvent<Blob>>) =>
      source.pipe(
        scan(
          (file: DownloadStatus, event: HttpEvent<Blob>): DownloadStatus => {
            switch (event.type) {
              case (HttpEventType.DownloadProgress || HttpEventType.UploadProgress): {
                return {
                  progress: event.total
                    ? Math.round((100 * event.loaded) / event.total)
                    : file.progress,
                  state: 'IN_PROGRESS',
                  content: null,
                  filename: filename,
                  id: id,
                  product: product,
                };
              }
              case (HttpEventType.ResponseHeader): {
                const eventURL = new URL(event.url).pathname;
                const newID = eventURL.substring(eventURL.lastIndexOf('/') + 1);
                return {
                  progress: 0,
                  state: 'PENDING',
                  content: null,
                  filename: newID,
                  id: id,
                  product: product,

                };
              }
              case (HttpEventType.Response): {
                if(this.dir){
                  if (saver) {
                    saver(event.body, this.dir);
                  }
                }
                return {
                  progress: 100,
                  state: 'DONE',
                  content: event.body,
                  filename: filename,
                  id: id,
                  product: product,

                };
              }
              default : {
                return file;
              }
            }
          },
          { state: 'PENDING', progress: 0, content: null, filename: '', id: '', product: null}
        ),
        distinctUntilChanged((a, b) => a.state === b.state
          && a.progress === b.progress
          && a.content === b.content
          && a.id === b.id
        )
      );
  }

}

