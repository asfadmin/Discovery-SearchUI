import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'readableSizeFromBytes'
})
export class ReadableSizeFromBytesPipe implements PipeTransform {

  transform(bytes: string): string {
    return this.getReadableSize(+bytes);
  }

  public getReadableSize(size: number): string {
    const bytes = size;
    const decimals = 2;

    if (bytes === 0) {
      return '0 Bytes';
    }

    const k = 1024;
    const dm = decimals || 2;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    const numUnits = String((bytes / Math.pow(k, i)).toFixed(dm));
    const unit = sizes[i];

    return `${numUnits} ${unit}`;
  }
}
