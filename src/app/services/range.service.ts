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
    const [start, end] = [
      range.start === null ? '' : range.start,
      range.end === null ? '' : range.end,
    ];

    return !(start || end) ?
      '' : `${start}to${end}`;
  }

  public toCMRString(range: Range<number>): string {
    const start = range.start !== null ? range.start.toString() : '';
    const end = range.end !== null ? range.end.toString() : '';

    return start ?
      ((!end || start === end) ? `${start}` : `${start}-${end}`) :
      (end ? `${end}` : '');
  }
}
