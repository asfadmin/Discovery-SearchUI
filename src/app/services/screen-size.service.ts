import { Injectable } from '@angular/core';

import { fromEvent, Observable } from 'rxjs';
import { map, debounceTime, startWith } from 'rxjs/operators';

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

  constructor() { }
}
