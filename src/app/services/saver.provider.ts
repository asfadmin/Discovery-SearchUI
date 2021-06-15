import { InjectionToken } from '@angular/core';
// @ts-ignore
import streamSaver from 'streamsaver';

export type Saver = (blob: Blob, filename?: string) => void;

export const SAVER = new InjectionToken<Saver>('saver');

export function myStreamSaver (blob, filename) {
  const fileStream = streamSaver.createWriteStream( filename, {
    size: blob.size // Makes the percentage visible in the download
  });

  const readableStream = blob.stream();

  // more optimized pipe version
  // (Safari may have pipeTo but it's useless without the WritableStream)
  if (window.WritableStream && readableStream.pipeTo) {
    return readableStream.pipeTo(fileStream);
      // .then(() => console.log('done writing'));
  }
}
export function getSaver(): Saver {
  return myStreamSaver;
}

// import {InjectionToken} from '@angular/core';
// import { saveAs } from 'file-saver';
//
// export type Saver = (blob: Blob, filename?: string) => void;
//
// export const SAVER = new InjectionToken<Saver>('saver');
//
// export function getSaver(): Saver {
//   return saveAs;
// }
