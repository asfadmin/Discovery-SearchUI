import {
  Component, OnInit, Input, ViewChild, ViewEncapsulation
} from '@angular/core';

import { fromEvent, combineLatest } from 'rxjs';
import { tap, withLatestFrom, filter, map, debounceTime } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as searchStore from '@store/search';
import * as scenesStore from '@store/scenes';
import * as filtersStore from '@store/filters';
import * as uiStore from '@store/ui';
import * as queueStore from '@store/queue';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import * as services from '@services';
import * as models from '@models';


@Component({
  selector: 'app-scenes-list',
  templateUrl: './scenes-list.component.html',
  styleUrls: ['./scenes-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ScenesListComponent implements OnInit {
  @ViewChild(CdkVirtualScrollViewport, { static: true }) scroll: CdkVirtualScrollViewport;

  public scenes$ = this.store$.select(scenesStore.getScenes);
  public scenes: models.CMRProduct[];
  public sceneNameLen: number;

  public numberOfQueue: {[scene: string]: [number, number]};
  public allQueued: {[scene: string]: boolean};
  public selected: string;

  public searchType: models.SearchType;
  public selectedFromList = true;
  public hoveredSceneName: string | null = null;

  constructor(
    private store$: Store<AppState>,
    private mapService: services.MapService,
    private screenSize: services.ScreenSizeService,
  ) {}

  ngOnInit() {
    this.screenSize.size$.pipe(
      map(size => size.width > 1775 ? 32 : 16),
    ).subscribe(len => this.sceneNameLen = len);

    this.store$.select(scenesStore.getSelectedScene).pipe(
      withLatestFrom(this.scenes$),
      filter(([selected, _]) => !!selected),
      tap(([selected, _]) => this.selected = selected.name),
      map(([selected, scenes]) => scenes.indexOf(selected)),
    ).subscribe(
      idx => {
        if (!this.selectedFromList) {
          this.scrollTo(idx);
        }

        this.selectedFromList = false;
      }
    );

    this.scenes$.subscribe(
      scenes => this.scenes = scenes
    );

    this.store$.select(searchStore.getIsLoading).subscribe(
      _ => this.scroll.scrollToOffset(0)
    );

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

    this.store$.select(uiStore.getSearchType).subscribe(
      searchType => this.searchType = searchType
    );

    const queueScenes$ = combineLatest(
      this.store$.select(queueStore.getQueuedProducts),
      this.store$.select(scenesStore.getSceneProducts),
    ).pipe(
      map(([queueProducts, searchScenes]) => {

        const queuedProductGroups: {[id: string]: string[]} = queueProducts.reduce((total, product) => {
          const scene = total[product.groupId] || [];

          total[product.groupId] = [...scene, product.id];
          return total;
        }, {});

        const numberOfQueuedProducts = {};

        Object.entries(searchScenes).map(([sceneName, products]) => {
          numberOfQueuedProducts[sceneName] = [
            (queuedProductGroups[sceneName] || []).length,
            (<any[]>products).length
          ];
        });

        return numberOfQueuedProducts;
      }
    ));

    queueScenes$.pipe(
      map(
        scenes => Object.entries(scenes)
          .reduce((total, [scene, amt]) => {
            total[scene] = `${amt[0]}/${amt[1]}`;

            return total;
          }, {})
    )).subscribe(numberOfQueue => this.numberOfQueue = numberOfQueue);

    queueScenes$.pipe(
      map(
        scenes => Object.entries(scenes)
          .reduce((total, [scene, amt]) => {
            total[scene] = amt[0] === amt[1];

            return total;
          }, {})
    )).subscribe(allQueued => this.allQueued = allQueued);
  }

  private selectNextScene(): void {
    this.store$.dispatch(new scenesStore.SelectNextScene());
  }

  private selectPreviousScene(): void {
    this.store$.dispatch(new scenesStore.SelectPreviousScene());
  }

  private scrollTo(idx: number): void {
    this.scroll.scrollToIndex(idx);
  }

  public onSceneSelected(id: string): void {
    this.selectedFromList = true;
    this.store$.dispatch(new scenesStore.SetSelectedScene(id));
  }

  public onToggleScene(e: Event, groupId: string): void {
    if (!this.allQueued[groupId]) {
      this.store$.dispatch(new queueStore.QueueScene(groupId));
    } else {
      this.store$.dispatch(new queueStore.RemoveSceneFromQueue(groupId));
    }
  }

  public onSetFocusedScene(scene: models.CMRProduct): void {
    this.hoveredSceneName = scene.name;
    this.store$.dispatch(new scenesStore.SetFocusedScene(scene));
  }

  public onClearFocusedScene(): void {
    this.hoveredSceneName = null;
    this.store$.dispatch(new scenesStore.ClearFocusedScene());
  }

  public onZoomTo(scene: models.CMRProduct): void {
    this.mapService.zoomToScene(scene);
  }
}
