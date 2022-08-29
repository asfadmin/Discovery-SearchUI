import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { SAVER, Saver } from '@services/saver.provider';
import { DownloadStatus } from '@models/download.model';

import { HttpEvent, HttpEventType } from '@angular/common/http';
import { catchError, distinctUntilChanged, scan } from 'rxjs/operators';
import { CMRProduct } from '@models';
import { NotificationService } from './notification.service';

import { Store } from '@ngrx/store';
import * as queueStore from '@store/queue';
import { AppState } from '@store';

@Injectable({ providedIn: 'root' })
export class DownloadService {
  public dir;
  constructor(
    private http: HttpClient,
    @Inject(SAVER) private save: Saver,
    private notificationService: NotificationService,
    private store$: Store<AppState>
  ) { }

  classicResp: Observable<DownloadStatus>;

  download(url: string, filename: string, product: CMRProduct, id, handle?): Observable<DownloadStatus> {

    const resp = this.http.get(url, {
      withCredentials: !(new URL(url).host.startsWith('hyp3')),
      reportProgress: true,
      observe: 'events',
      responseType: 'blob',
    });
    handle = handle ?? this.dir;
    return resp.pipe(this.download$(filename, id, product, (blob) => this.save(blob, url, filename, handle))).pipe(
      catchError(err => {
        this.notificationService.error('This file will appear in your default downloads folder and not the location you selected',
        'Issue Downloading', {
        });
        return throwError(err);
      }),
    );
  }
  async getDirectory( getNew= false): Promise<any> {
    return new Promise(resolve => {
      if (!this.dir || getNew) {
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
                saver(event.body).then(fileResponse => {
                  if (fileResponse.status === 'error') {
                    this.notificationService.error('There was an error downloading the file. Make sure that you allowed your browser to access the right files');
                  }
                  this.store$.dispatch(new queueStore.DownloadProduct({
                    progress: 100,
                    state: 'DONE',
                    filename: filename,
                    id: id,
                    product: product,
                  }));
                });
                return {
                  progress: 100,
                  state: 'SAVING',
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

