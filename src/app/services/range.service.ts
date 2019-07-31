import { Injectable } from '@angular/core';
import { Range } from '@models';

@Injectable({
  providedIn: 'root'
})
export class RangeService {

  constructor() { }

  public toString<T>(range: Range<T>): string {
    const [start, end] = [ range.start || '', range.end || '' ];

    return !(start && end) ?
      '' : `${start}-${end}`;
  }

  public toCMRString<T>(range: Range<T>): string {
    const [start, end] = [ range.start || '', range.end || '' ];

    if (!(start && end)) {
      return '';
    } else if (start === end) {
      return `${start}`;
    } else {
      return `${start}-${end}`;
    }
  }
}
