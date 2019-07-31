import { Injectable } from '@angular/core';
import { Range } from '@models';

@Injectable({
  providedIn: 'root'
})
export class RangeService {

  constructor() { }

  public toString<T>(range: Range<T>): string {
    const [start, end] = [ range.start || '', range.end || '' ];

    return `${start}-${end}`;
  }
}
