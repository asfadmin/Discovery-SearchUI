import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, throwError } from 'rxjs';
import { catchError, distinctUntilChanged, scan } from 'rxjs/operators';

import { CMRProduct } from '@models';
import { DownloadStatus } from '@models/download.model';
import { SAVER, Saver } from '@services/saver.provider';
import { AppState } from '@store';
import * as queueStore from '@store/queue';

import { NotificationService } from './notification.service';

@Injectable({ providedIn: 'root' })
export class DownloadService {
  private http = inject(HttpClient);
  private save = inject<Saver>(SAVER);
  private notificationService = inject(NotificationService);
  private store$ = inject<Store<AppState>>(Store);
  private translateService = inject(TranslateService);

  public dir;
  public hasDownloadedBursts = false;

  classicResp: Observable<DownloadStatus>;

  download(
    url: string,
    filename: string,
    product: CMRProduct,
    id,
    handle?,
  ): Observable<DownloadStatus> {
    const resp = this.http.get(url, {
      withCredentials: !new URL(url).host.startsWith('hyp3'),
      reportProgress: true,
      observe: 'events',
      responseType: 'blob',
    });
    handle = handle ?? this.dir;
    return resp
      .pipe(
        this.download$(filename, id, product, (blob) =>
          this.save(blob, url, filename, handle),
        ),
      )
      .pipe(
        catchError((err) => {
          if (product.dataset === 'JERS-1') {
            this.notificationService.error(
              'This file may need you to sign a restricted dataset agreement',
              'Issue Downloading',
              {},
            );
          } else {
            this.notificationService.error(
              'This file will appear in your default downloads folder and not the location you selected',
              'Issue Downloading',
              {},
            );
          }
          return throwError(err);
        }),
      );
  }

  async getDirectory(getNew = false): Promise<any> {
    return new Promise((resolve) => {
      if (!this.dir || getNew) {
        //@ts-expect-error Use in development browser functionality
        window.showDirectoryPicker().then((dir) => {
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
    return new Promise((resolve) => {
      window
        //@ts-expect-error Use in development browser functionality
        .showSaveFilePicker({
          suggestedName: filename,
        })
        .then((file) => {
          resolve(file);
        });
    });
  }
  private download$(
    filename: string,
    id: string,
    product: CMRProduct,
    saver?: (b: Blob) => Promise<any>,
  ): (source: Observable<HttpEvent<Blob>>) => Observable<DownloadStatus> {
    return (source: Observable<HttpEvent<Blob>>) =>
      source.pipe(
        scan(
          (file: DownloadStatus, event: HttpEvent<Blob>): DownloadStatus => {
            switch (event.type) {
              case HttpEventType.DownloadProgress ||
                HttpEventType.UploadProgress: {
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
              case HttpEventType.ResponseHeader: {
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
              case HttpEventType.Response: {
                saver(event.body).then((fileResponse) => {
                  if (fileResponse.status === 'error') {
                    this.notificationService.error(
                      this.translateService.instant('DOWNLOAD_FILE_ERROR'),
                    );
                  }
                  this.store$.dispatch(
                    new queueStore.DownloadProduct({
                      progress: 100,
                      state: 'DONE',
                      filename: filename,
                      id: id,
                      product: product,
                    }),
                  );
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
          {
            state: 'PENDING',
            progress: 0,
            filename: '',
            id: '',
            product: null,
          },
        ),
        distinctUntilChanged(
          (a, b) =>
            a.state === b.state && a.progress === b.progress && a.id === b.id,
        ),
      );
  }
}
