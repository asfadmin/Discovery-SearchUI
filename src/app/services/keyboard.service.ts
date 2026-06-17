import { Injectable, inject, computed } from '@angular/core';
import { fromEvent } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import * as uiStore from '@store/ui';
import { ScenesService } from './scenes.service';
import { SceneSelectService } from './scene-select.service';
import * as models from '@models';

@Injectable({
  providedIn: 'root',
})
export class KeyboardService {
  private store$ = inject<Store<AppState>>(Store);
  private sceneSelect = inject(SceneSelectService);
  private scenesService = inject(ScenesService);

  private isPreferencesOpen = this.store$.selectSignal(
    uiStore.getIsPreferenceMenuOpen,
  );
  private isFiltersMenuOpen = this.store$.selectSignal(
    uiStore.getIsFiltersMenuOpen,
  );
  private isDownloadQueueOpen = this.store$.selectSignal(
    uiStore.getIsDownloadQueueOpen,
  );
  private isOnDemandQueueOpen = this.store$.selectSignal(
    uiStore.getIsOnDemandQueueOpen,
  );

  private selectedScene = this.store$.selectSignal(
    scenesStore.getSelectedScene,
  );
  private onlyScenesWithBrowse = this.store$.selectSignal(
    uiStore.getOnlyScenesWithBrowse,
  );
  private isBrowseDialogOpen = this.store$.selectSignal(
    uiStore.getIsBrowseDialogOpen,
  );

  private scenesSorted = toSignal(
    this.scenesService.sortScenes$(this.scenesService.scenes$),
    { initialValue: [] },
  );
  private scenesWithBrowses = toSignal(
    this.scenesService.withBrowses$(
      this.scenesService.sortScenes$(this.scenesService.scenes$),
    ),
    { initialValue: [] },
  );

  private isMenuOpen = computed(() => {
    return (
      this.isPreferencesOpen() ||
      this.isFiltersMenuOpen() ||
      this.isDownloadQueueOpen() ||
      this.isOnDemandQueueOpen()
    );
  });

  private sceneList = computed(() => {
    const withBrowse = this.isBrowseDialogOpen() && this.onlyScenesWithBrowse();
    return withBrowse ? this.scenesWithBrowses() : this.scenesSorted();
  });

  private initialized = false;

  init() {
    if (this.initialized) {
      return;
    }
    this.initialized = true;

    fromEvent<KeyboardEvent>(document, 'keydown').subscribe((e) => {
      if (this.isMenuOpen()) {
        return;
      }

      const sceneList = this.sceneList();
      const selected = this.selectedScene();

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          return this.selectNextScene(sceneList, selected);
        case 'ArrowLeft':
        case 'ArrowUp':
          return this.selectPreviousScene(sceneList, selected);
      }
    });
  }

  private selectNextScene(
    scenes: models.CMRProduct[],
    selected: models.CMRProduct,
  ) {
    const id = this.sceneSelect.nextId(scenes, selected);
    this.store$.dispatch(new scenesStore.SetSelectedScene(id));
  }

  private selectPreviousScene(
    scenes: models.CMRProduct[],
    selected: models.CMRProduct,
  ) {
    const id = this.sceneSelect.previousId(scenes, selected);
    this.store$.dispatch(new scenesStore.SetSelectedScene(id));
  }
}
