import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as scenesStore from '@store/scenes';

import * as models from '@models';

@Component({
  selector: 'app-browse-list',
  templateUrl: './browse-list.component.html',
  styleUrls: ['./browse-list.component.scss']
})
export class BrowseListComponent implements OnInit {
  public scenes: models.CMRProduct[];
  public selectedName: string;

  constructor(
    private store$: Store<AppState>,
  ) { }

  ngOnInit() {
    this.store$.select(scenesStore.getScenes).subscribe(
      scenes => this.scenes = scenes
    );

    this.store$.select(scenesStore.getSelectedScene).subscribe(
      scene => this.selectedName = scene ? scene.name : null
    );
  }

  public onNewSceneSelected(scene: models.CMRProduct): void {
    this.store$.dispatch(new scenesStore.SetSelectedScene(scene.id));
  }
}
