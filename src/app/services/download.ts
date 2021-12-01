import {
  HttpEvent,
  HttpEventType, HttpHeaderResponse,
  HttpProgressEvent,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { distinctUntilChanged, scan } from 'rxjs/operators';

function isHttpResponse<T>(event: HttpEvent<T>): event is HttpResponse<T> {
  return event.type === HttpEventType.Response;
}

function isHttpHeader(event: HttpEvent<unknown>): event is HttpHeaderResponse {
  return event.type === HttpEventType.ResponseHeader;
}

function isHttpProgressEvent(
  event: HttpEvent<unknown>
): event is HttpProgressEvent {
  return (
    event.type === HttpEventType.DownloadProgress ||
    event.type === HttpEventType.UploadProgress
  );
}

export interface Download {
  content: Blob | null;
  progress: number;
  state: 'PENDING' | 'IN_PROGRESS' | 'DONE';
  id: string;
}

export function download(
  id: string,
  saver?: (b: Blob) => void): (source: Observable<HttpEvent<Blob>>) => Observable<Download> {

  console.log('download.ts download() id:', id);
  console.log('download.ts saver:', saver);

  return (source: Observable<HttpEvent<Blob>>) =>
    source.pipe(
      scan(
        // tslint:disable-next-line:no-shadowed-variable
        (download: Download, event): Download => {
          console.log('download.ts download() event:', event);
          if (isHttpHeader(event)) {
            const matches = event.url.match(/([A-Z])\w+\.[a-z]+/g);
            const newID = matches ? matches[matches.length - 1] : event.url.substring(event.url.lastIndexOf('/') + 1);
            console.log('event.url is:', event.url);
            console.log('newID is:', newID);
            return {
              progress: 0,
              state: 'PENDING',
              content: null,
              id: newID
            };
          }
          if (isHttpProgressEvent(event)) {
            return {
              progress: event.total
                ? Math.round((100 * event.loaded) / event.total)
                : download.progress,
              state: 'IN_PROGRESS',
              content: null,
              id: id,
            };
          }
          if (isHttpResponse(event)) {
            if (saver) {
              saver(event.body);
            }
            return {
              progress: 100,
              state: 'DONE',
              content: event.body,
              id: id,
            };
          }
          return download;
        },
        { state: 'PENDING', progress: 0, content: null, id: '' }
      ),
      distinctUntilChanged((a, b) => a.state === b.state
        && a.progress === b.progress
        && a.content === b.content
        && a.id === b.id
      )
    );
}
