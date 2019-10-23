import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { map } from 'rxjs/operators';

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
  public products: models.CMRProduct[];
  public queuedProductIds: Set<string>;

  constructor(
    private store$: Store<AppState>
  ) { }

  ngOnInit() {
    this.store$.select(scenesStore.getSelectedSceneProducts).subscribe(
      products => this.products = products
    );

    this.store$.select(queueStore.getQueuedProductIds).pipe(
      map(names => new Set(names))
    ).subscribe(queuedProducts => this.queuedProductIds = queuedProducts);
  }

  public onToggleQueueProduct(product: models.CMRProduct): void {
    this.store$.dispatch(new queueStore.ToggleProduct(product));
  }
}
