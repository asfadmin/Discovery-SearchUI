import { Component, OnInit } from '@angular/core';

import { map, withLatestFrom } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import * as queueStore from '@store/queue';

import * as models from '@models';

@Component({
  selector: 'app-scene-files',
  templateUrl: './scene-files.component.html',
  styleUrls: ['./scene-files.component.scss']
})
export class SceneFilesComponent implements OnInit {
  public products$ = this.store$.select(scenesStore.getSelectedSceneProducts);
  public queuedProductIds$ = this.store$.select(queueStore.getQueuedProductIds).pipe(
      map(names => new Set(names))
  );
  public unzippedLoading: string;

  constructor(
    private store$: Store<AppState>
  ) { }

  ngOnInit() {
    this.store$.select(scenesStore.getUnzipLoading).subscribe(
      unzippedLoading => this.unzippedLoading = unzippedLoading
    );
  }

  public onToggleQueueProduct(product: models.CMRProduct): void {
    this.store$.dispatch(new queueStore.ToggleProduct(product));
  }

  public onUnzipProduct(product: models.CMRProduct): void {
    this.store$.dispatch(new scenesStore.LoadUnzippedProduct(product));
  }
}
