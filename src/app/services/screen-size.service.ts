import { Injectable } from '@angular/core';

import { fromEvent, Observable } from 'rxjs';
import { map, debounceTime, startWith } from 'rxjs/operators';

import * as models from '@models';

export interface ScreenSize {
  width: number;
  height: number;
}

@Injectable({
  providedIn: 'root'
})
export class ScreenSizeService {
  public size$: Observable<ScreenSize> = fromEvent(window, 'resize').pipe(
    startWith({
      width: window.innerWidth,
      height: window.innerHeight
    }),
     map(_ => ({
       width: document.documentElement.clientWidth,
       height: document.documentElement.clientHeight
     })),
     debounceTime(100),
  );

  public breakpoint$ = this.size$.pipe(
    map(({ width, height }) => {
      if (width > 1700) {
        return models.Breakpoints.FULL;
      } else if (width > 1390) {
        return models.Breakpoints.MEDIUM;
      } else if (width > 1130) {
        return models.Breakpoints.SMALL;
      } else {
        return models.Breakpoints.MOBILE;
      }
    })
  );

  constructor() { }
}
