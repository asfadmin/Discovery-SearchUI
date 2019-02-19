import { Injectable } from '@angular/core';
import { Range } from '@models';

@Injectable({
  providedIn: 'root'
})
export class RangeService {

  constructor() { }

  public toString<T>(range: Range<T>): string {
    const filteredRange = Object.values(range)
      .filter(v => !!v);

    const unique = Array.from(new Set(filteredRange));

    return unique.length === 2 ?
      unique.join('-') :
      unique.pop() || null;
  }
}
