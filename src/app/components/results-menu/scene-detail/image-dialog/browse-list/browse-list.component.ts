import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { map, filter, withLatestFrom, tap } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as scenesStore from '@store/scenes';

import * as models from '@models';

@Component({
  selector: 'app-browse-list',
  templateUrl: './browse-list.component.html',
  styleUrls: ['./browse-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BrowseListComponent implements OnInit {
  @ViewChild(CdkVirtualScrollViewport, { static: false }) scroll: CdkVirtualScrollViewport;

  public scenes: models.CMRProduct[];
  public selectedName: string;
  private selectedFromList = true;

  constructor(
    private store$: Store<AppState>,
  ) { }

  ngOnInit() {
    this.store$.select(scenesStore.getScenes).subscribe(
      scenes => this.scenes = scenes
    );

    this.store$.select(scenesStore.getSelectedScene).pipe(
      withLatestFrom(this.store$.select(scenesStore.getScenes)),
      filter(([selected, _]) => !!selected),
      tap(([selected, _]) => this.selectedName = selected.name),
      map(([selected, scenes]) => scenes.indexOf(selected)),
    ).subscribe(
      idx => {
        if (!this.selectedFromList) {
          this.scroll.scrollToIndex(idx);
        }

        this.selectedFromList = false;
      }
    );

    this.store$.select(scenesStore.getSelectedScene).subscribe(
      scene => this.selectedName = scene ? scene.name : null
    );
  }

  public onNewSceneSelected(scene: models.CMRProduct): void {
    this.selectedFromList = true;
    this.store$.dispatch(new scenesStore.SetSelectedScene(scene.id));
  }
}
