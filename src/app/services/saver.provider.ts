import { InjectionToken } from '@angular/core';

// @ts-ignore
import streamSaver from 'streamsaver';

export type Saver = (blob: Blob, url: string, filename?: string, window?: any) => void;

export const SAVER = new InjectionToken<Saver>('saver');

export function myStreamSaver (blob, _url, filename, handle) {
  if (handle.kind === 'directory') {
    handle.getFileHandle(filename, {create: true}).then(
      file => {
        file.createWritable().then(writable => {
          writable.write(blob).then(() => {
            writable.close();
          });
        });
      }
    );
  } else if (handle.kind === 'file') {
    handle.createWritable().then(writable => {
      writable.write(blob).then(() => {
        writable.close();
      });
    });
  }

}

export function getSaver(): Saver {
  return myStreamSaver;
}
