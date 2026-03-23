import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'readableSizeFromBytes' })
export class ReadableSizeFromBytesPipe implements PipeTransform {
  transform(bytes: string | number): string {
    if (bytes === null || bytes === undefined || isNaN(+bytes)) {
      return '0 Bytes';
    }
    return this.getReadableSize(+bytes);
  }

  public getReadableSize(bytes: number): string {
    const decimals = 2;

    if (!bytes || isNaN(bytes)) {
      return '0 Bytes';
    }
    const k = 1000;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    const unit = sizes[i];

    const numUnits =
      unit !== 'B'
        ? String((bytes / Math.pow(k, i)).toFixed(decimals))
        : String(bytes / Math.pow(k, i));

    return `${numUnits} ${unit}`;
  }
}
