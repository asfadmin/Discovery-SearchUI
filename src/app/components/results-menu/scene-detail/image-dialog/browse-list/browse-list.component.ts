import { Component, OnInit, AfterViewInit, ViewEncapsulation, ViewChild } from '@angular/core';
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
export class BrowseListComponent implements OnInit, AfterViewInit  {
  @ViewChild(CdkVirtualScrollViewport, { static: false }) scroll: CdkVirtualScrollViewport;

  public scenes$ = this.store$.select(scenesStore.getScenesWithBrowse);
  public scenes: models.CMRProduct[];
  public selectedName: string;
  private selectedFromList = false;

  constructor(
    private store$: Store<AppState>,
  ) { }

  ngOnInit() {
    this.scenes$.subscribe(
      scenes => this.scenes = scenes
    );

    this.store$.select(scenesStore.getSelectedScene).subscribe(
      scene => this.selectedName = scene ? scene.name : null
    );
  }

  ngAfterViewInit() {
    this.store$.select(scenesStore.getSelectedScene).pipe(
      withLatestFrom(this.scenes$),
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
  }

  public onNewSceneSelected(scene: models.CMRProduct): void {
    this.selectedFromList = true;
    this.store$.dispatch(new scenesStore.SetSelectedScene(scene.id));
  }
}
