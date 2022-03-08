import { InjectionToken } from '@angular/core';

// @ts-ignore
import streamSaver from 'streamsaver';

export type Saver = (blob: Blob, url: string, filename?: string, window?: any) => void;

export const SAVER = new InjectionToken<Saver>('saver');

export function myStreamSaver (blob, _url, filename, dir) {

  dir.getFileHandle(filename, {create: true}).then(
    file => {
      file.createWritable().then(writable => {
        writable.write(blob);
        writable.close();
      })
    }
  )
  const fileStream = streamSaver.createWriteStream( filename, {
    size: blob.size // Makes the percentage visible in the download
  });

  const readableStream = blob.stream();

  // more optimized pipe version
  // (Safari may have pipeTo but it's useless without the WritableStream)
  if (streamSaver.WritableStream && readableStream.pipeTo) {
    return readableStream.pipeTo(fileStream)
      .then(() => console.log('pipeTo fileStream done writing'));
  }

  // less optimized
  const writer = fileStream.getWriter();
  const reader = readableStream.body.getReader();
  const pump = () => reader.read()
    .then(res => readableStream.done
      ? writer.close()
      : writer.write(res.value).then(pump));
  pump().then();

}

export function getSaver(): Saver {
  return myStreamSaver;
}
