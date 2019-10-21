import { Injectable } from '@angular/core';

import { fromEvent, combineLatest } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import * as uiStore from '@store/ui';


@Injectable({
  providedIn: 'root'
})
export class KeyboardService {

  constructor(
    private store$: Store<AppState>,
  ) { }

  init() {
    fromEvent(document, 'keydown').pipe(
      withLatestFrom(combineLatest(
        this.store$.select(uiStore.getOnlyScenesWithBrowse),
        this.store$.select(uiStore.getIsBrowseDialogOpen)
      ))
    ).subscribe(([e, [ onlyScenesWithBrowse, isBrowseDialogOpen ]]) => {
      const { key } = <KeyboardEvent>e;
      const withBrowse = isBrowseDialogOpen && onlyScenesWithBrowse;

      switch (key) {
        case 'ArrowRight': {
          return this.selectNextScene(withBrowse);
        }
        case 'ArrowLeft': {
          return this.selectPreviousScene(withBrowse);
        }

        case 'ArrowDown': {
          return this.selectNextScene(withBrowse);
        }
        case 'ArrowUp': {
          return this.selectPreviousScene(withBrowse);
        }
      }
    });
  }

  private selectNextScene(withBrowse: boolean): void {
    this.store$.dispatch(withBrowse ?
      new scenesStore.SelectNextWithBrowse() :
      new scenesStore.SelectNextScene()
    );
  }

  private selectPreviousScene(withBrowse: boolean): void {
    this.store$.dispatch(withBrowse ?
      new scenesStore.SelectPreviousWithBrowse :
      new scenesStore.SelectPreviousScene()
    );
  }
}
