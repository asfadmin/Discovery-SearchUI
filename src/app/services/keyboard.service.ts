import { Injectable } from '@angular/core';

import { fromEvent, combineLatest } from 'rxjs';
import { filter, map, withLatestFrom } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import * as uiStore from '@store/ui';
import { ScenesService } from './scenes.service';
import { SceneSelectService } from './scene-select.service';


@Injectable({
  providedIn: 'root'
})
export class KeyboardService {
  constructor(
    private store$: Store<AppState>,
    private sceneSelect: SceneSelectService,
    private scenesService: ScenesService,
  ) { }

  init() {
    const scenesSorted$ = this.scenesService.sortScenes$(
      this.scenesService.scenes$
    );

    fromEvent(document, 'keydown').pipe(
      withLatestFrom(this.store$.select(uiStore.getIsPreferenceMenuOpen)),
      filter(([_, arePreferencesOpen]) => !arePreferencesOpen),
      map(([e, _]) => e),
      withLatestFrom(combineLatest([
          scenesSorted$,
          this.scenesService.withBrowses$(scenesSorted$),
          this.store$.select(scenesStore.getSelectedScene),
          this.store$.select(uiStore.getOnlyScenesWithBrowse),
          this.store$.select(uiStore.getIsBrowseDialogOpen),
        ])
      ),
    ).subscribe(([e, [ scenes, scenesWithBrowses, selected, onlyScenesWithBrowse, isBrowseDialogOpen ]]) => {
      const { key } = <KeyboardEvent>e;
      const withBrowse = isBrowseDialogOpen && onlyScenesWithBrowse;
      const sceneList = withBrowse ? scenesWithBrowses : scenes;

      switch (key) {
        case 'ArrowRight': {
          return this.selectNextScene(sceneList, selected);
        }
        case 'ArrowLeft': {
          return this.selectPreviousScene(sceneList, selected);
        }
        case 'ArrowDown': {
          return this.selectNextScene(sceneList, selected);
        }
        case 'ArrowUp': {
          return this.selectPreviousScene(sceneList, selected);
        }
      }
    });
  }

  private selectNextScene(scenes, selected) {
    const id = this.sceneSelect.nextId(scenes, selected);
    this.store$.dispatch(new scenesStore.SetSelectedScene(id));
  }

  private selectPreviousScene(scenes, selected) {
    const id = this.sceneSelect.previousId(scenes, selected);
    this.store$.dispatch(new scenesStore.SetSelectedScene(id));
  }
}
