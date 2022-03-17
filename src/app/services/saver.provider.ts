import { InjectionToken } from '@angular/core';

// @ts-ignore
import streamSaver from 'streamsaver';

export type Saver = (blob: Blob, url: string, filename?: string, window?: any) => Promise<any>;

export const SAVER = new InjectionToken<Saver>('saver');

export async function myStreamSaver (blob, _url, filename, handle) : Promise<any> {
  return new Promise(resolve => {
    if (handle.kind === 'directory') {
      handle.getFileHandle(filename, {create: true}).then(
        file => {
          const value = writeToFile(file, blob);
          resolve(value);
        }
      );
    } else if (handle.kind === 'file') {
      const value = writeToFile(handle, blob);
      resolve(value);
    }
  });
}
function writeToFile(fileHandle, blob): Promise<any> {
  return new Promise(resolve => {
    fileHandle.createWritable().then(writable => {
    writable.write(blob).then(() => {
      writable.close();
      resolve({status: 'done'});
    }, (err) => {
        resolve({status: 'error', error: err});
    });
    }, (err) => {
          resolve({status: 'error', error: err});
    });
  });
}
export function getSaver(): Saver {
  return myStreamSaver;
}
