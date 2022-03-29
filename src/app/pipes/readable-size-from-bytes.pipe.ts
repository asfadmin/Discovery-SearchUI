import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'readableSizeFromBytes'
})
export class ReadableSizeFromBytesPipe implements PipeTransform {

  transform(bytes: string | number): string {
    return this.getReadableSize(+bytes);
  }

  public getReadableSize(bytes: number): string {
    const decimals = 2;

    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1000;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    const numUnits = String((bytes / Math.pow(k, i))
      .toFixed(decimals));

    const unit = sizes[i];
    return `${numUnits} ${unit}`;
  }
}
