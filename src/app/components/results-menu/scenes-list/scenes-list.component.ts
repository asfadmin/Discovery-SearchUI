import {
  Component, OnInit, Input, ViewChild, ViewEncapsulation,
  AfterViewInit, OnDestroy
} from '@angular/core';

import { fromEvent, combineLatest, Observable, timer } from 'rxjs';
import { tap, withLatestFrom, filter, map, debounceTime, delay } from 'rxjs/operators';
import { SubSink } from 'subsink';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as searchStore from '@store/search';
import * as scenesStore from '@store/scenes';
import * as queueStore from '@store/queue';

import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import * as services from '@services';
import * as models from '@models';


@Component({
  selector: 'app-scenes-list',
  templateUrl: './scenes-list.component.html',
  styleUrls: ['./scenes-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ScenesListComponent implements OnInit, OnDestroy {
  @ViewChild(CdkVirtualScrollViewport, { static: true }) scroll: CdkVirtualScrollViewport;
  @Input() resize$: Observable<void>;

  public scenes;
  public sceneNameLen: number;

  public numberOfQueue: {[scene: string]: [number, number]};
  public allQueued: {[scene: string]: boolean};
  public selected: string;
  public copyIcon = faCopy;

  public selectedFromList = false;
  public hoveredSceneName: string | null = null;

  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    private mapService: services.MapService,
    private screenSize: services.ScreenSizeService,
    private keyboardService: services.KeyboardService,
  ) {}

  ngOnInit() {
    this.keyboardService.init();

    this.subs.add(
      this.store$.select(scenesStore.getSelectedScene).pipe(
        withLatestFrom(this.store$.select(scenesStore.getScenes)),
        /* There is some race condition with scrolling before the list is rendered.
         * Doesn't scroll without the delay even though the function is called.
         * */
        delay(20),
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
      )
    );

    this.subs.add(
      this.store$.select(scenesStore.getScenes).subscribe(
        scenes => this.scenes = scenes
      )
    );

    this.subs.add(
      this.screenSize.size$.pipe(
        map(size => {
          if (size.width > 1775) {
            return 32;
          } else if (size.width > 1350) {
            return 20;
          } else {
            return 10;
          }
        }),
      ).subscribe(len => this.sceneNameLen = len)
    );

    const queueScenes$ = combineLatest(
      this.store$.select(queueStore.getQueuedProducts),
      this.store$.select(scenesStore.getAllSceneProducts),
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

    this.subs.add(
      queueScenes$.pipe(
        map(
          scenes => Object.entries(scenes)
            .reduce((total, [scene, amt]) => {
              total[scene] = `${amt[0]}/${amt[1]}`;

              return total;
            }, {})
      )).subscribe(numberOfQueue => this.numberOfQueue = numberOfQueue)
    );

    this.subs.add(
      queueScenes$.pipe(
        map(
          scenes => Object.entries(scenes)
            .reduce((total, [scene, amt]) => {
              total[scene] = amt[0] === amt[1];

              return total;
            }, {})
      )).subscribe(allQueued => this.allQueued = allQueued)
    );

    this.resize$.subscribe(
      _ => this.scroll.checkViewportSize()
    );

    this.subs.add(
      this.store$.select(searchStore.getIsLoading).pipe(
        filter(_ => !!this.scroll)
      ).subscribe(
        _ => this.scroll.scrollToOffset(0)
      )
    );
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
  }

  public onClearFocusedScene(): void {
    this.hoveredSceneName = null;
  }

  public onZoomTo(scene: models.CMRProduct): void {
    this.mapService.zoomToScene(scene);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
