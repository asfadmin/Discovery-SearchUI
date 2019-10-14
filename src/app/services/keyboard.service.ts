import { Injectable } from '@angular/core';

import { fromEvent } from 'rxjs';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as scenesStore from '@store/scenes';


@Injectable({
  providedIn: 'root'
})
export class KeyboardService {

  constructor(
    private store$: Store<AppState>,
  ) { }

  init() {
    fromEvent(document, 'keydown').subscribe((e: KeyboardEvent) => {
      const { key } = e;

      switch (key) {
        case 'ArrowRight': {
          return this.selectNextScene();
        }
        case 'ArrowLeft': {
          return this.selectPreviousScene();
        }

        case 'ArrowDown': {
          return this.selectNextScene();
        }
        case 'ArrowUp': {
          return this.selectPreviousScene();
        }
      }
    });
  }

  private selectNextScene(): void {
    this.store$.dispatch(new scenesStore.SelectNextScene());
  }

  private selectPreviousScene(): void {
    this.store$.dispatch(new scenesStore.SelectPreviousScene());
  }

}
