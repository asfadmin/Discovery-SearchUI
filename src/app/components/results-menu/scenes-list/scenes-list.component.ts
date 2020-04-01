import {
  Component, OnInit, Input, ViewChild, ViewEncapsulation, OnDestroy
} from '@angular/core';

import { combineLatest, Observable } from 'rxjs';
import { tap, withLatestFrom, filter, map, delay } from 'rxjs/operators';
import { SubSink } from 'subsink';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as searchStore from '@store/search';
import * as scenesStore from '@store/scenes';
import * as queueStore from '@store/queue';
import * as filtersStore from '@store/filters';

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

  public numberOfQueue: {[scene: string]: [number, number]};
  public allQueued: {[scene: string]: boolean};
  public selected: string;
  public copyIcon = faCopy;

  public offsets = {temporal: 0, perpendicular: 0};
  public selectedFromList = false;
  public hoveredSceneName: string | null = null;

  private subs = new SubSink();

  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;

  public searchType: models.SearchType;
  public SearchTypes = models.SearchType;


  constructor(
    private store$: Store<AppState>,
    private mapService: services.MapService,
    private screenSize: services.ScreenSizeService,
    private keyboardService: services.KeyboardService,
    private scenesService: services.ScenesService,
  ) {}

  ngOnInit() {
    this.keyboardService.init();

    this.subs.add(
      this.store$.select(scenesStore.getMasterOffsets).subscribe(
        offsets => this.offsets = offsets
      )
    );

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
      this.scenesService.scenesSorted$().subscribe(
        scenes => this.scenes = scenes
      )
    );

    this.subs.add(
      this.store$.select(searchStore.getSearchType).subscribe(
        searchType => this.searchType = searchType
      )
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
