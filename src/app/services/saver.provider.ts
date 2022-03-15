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
          blob.stream().pipeTo(writable);
        });
      }
    );
  } else if (handle.kind === 'file') {
    handle.createWritable().then(writable => {
      blob.stream().pipeTo(writable);
    });
  }

}

export function getSaver(): Saver {
  return myStreamSaver;
}
