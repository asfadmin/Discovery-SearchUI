import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SAVER, Saver } from '@services/saver.provider';
import { DownloadStatus } from '@models/download.model';

import { HttpEvent, HttpEventType } from '@angular/common/http';
import { distinctUntilChanged, scan } from 'rxjs/operators';
import { CMRProduct } from '@models';
import { NotificationService } from './notification.service';


@Injectable({ providedIn: 'root' })
export class DownloadService {
  public dir;
  constructor(
    private http: HttpClient,
    @Inject(SAVER) private save: Saver,
    private notificationService: NotificationService
  ) { }

  classicResp: Observable<DownloadStatus>;

  download(url: string, filename: string, product: CMRProduct, id, handle?): Observable<DownloadStatus> {

    const resp = this.http.get(url, {
      withCredentials: !(new URL(url).origin.startsWith('hyp3')),
      reportProgress: true,
      observe: 'events',
      responseType: 'blob',
    });
    handle = handle ?? this.dir;
    return resp.pipe(this.download$(filename, id, product, (blob) => this.save(blob, url, filename, handle)));

  }
  async getDirectory(): Promise<any> {
    return new Promise(resolve => {
      if (!this.dir) {
      /* @ts-ignore:disable-next-line */
        window.showDirectoryPicker().then(dir => {
          this.dir = dir;
          dir.requestPermission({ mode: 'readwrite' }).then(() => {
            resolve(this.dir);
          });
        });
      } else {
        resolve(this.dir);
      }
    });
  }
  async getFileHandle(filename: string): Promise<any> {
    return new Promise(resolve => {
      /* @ts-ignore:disable-next-line */
      window.showSaveFilePicker({
        suggestedName: filename
      }).then(file => {
        resolve(file);
      });
    });
  }
  private download$(
    filename: string,
    id: string,
    product: CMRProduct,
    saver?: (b: Blob) => Promise<any>): (source: Observable<HttpEvent<Blob>>) => Observable<DownloadStatus> {


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
                  filename: newID,
                  id: id,
                  product: product,

                };
              }
              case (HttpEventType.Response): {
                if (saver) {
                  saver(event.body).then(stuff => {
                    console.log(stuff);
                    if (stuff.status === 'error') {
                      this.notificationService.error('There was an error downloading the file. Make sure that you allowed your browser to access the right files');
                    }
                  });
                }
                return {
                  progress: 100,
                  state: 'DONE',
                  filename: filename,
                  id: id,
                  product: product,

                };
              }
              default: {
                return file;
              }
            }
          },
          { state: 'PENDING', progress: 0, filename: '', id: '', product: null }
        ),
        distinctUntilChanged((a, b) => a.state === b.state
          && a.progress === b.progress
          && a.id === b.id
        )
      );
  }

}

