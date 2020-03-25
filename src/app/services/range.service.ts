import { Injectable } from '@angular/core';
import { Range } from '@models';

@Injectable({
  providedIn: 'root'
})
export class RangeService {

  constructor() { }

  public toString<T>(range: Range<T>): string {
    const [start, end] = [ range.start || '', range.end || '' ];

    return !(start || end) ?
      '' : `${start}-${end}`;
  }

  public toStringWithNegatives<T>(range: Range<T>): string {
    const [start, end] = [ range.start || '', range.end || '' ];

    return !(start || end) ?
      '' : `${start}to${end}`;
  }

  public toCMRString<T>(range: Range<T>): string {
    const [start, end] = [ range.start || '', range.end || '' ];

    return start ?
      ((!end || start === end) ? `${start}` : `${start}-${end}`) :
      (end ? `${end}` : '');
  }
}
