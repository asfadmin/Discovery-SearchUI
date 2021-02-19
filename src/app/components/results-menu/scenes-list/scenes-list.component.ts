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

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import * as services from '@services';
import * as models from '@models';
import { QueuedHyp3Job } from '@models';

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
  public pairs;
  public jobs;

  public numberOfQueue: {[scene: string]: [number, number]};
  public allQueued: {[scene: string]: boolean};
  public allJobNames: string[];
  public queuedJobs: QueuedHyp3Job[];
  public selected: string;
  public selectedPair: string[];

  public offsets = {temporal: 0, perpendicular: 0};
  public selectedFromList = false;
  public hoveredSceneName: string | null = null;
  public hoveredPairNames: string | null = null;

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
    private pairService: services.PairService,
  ) {}

  ngOnInit() {
    this.keyboardService.init();

    this.subs.add(
      this.store$.select(scenesStore.getMasterOffsets).subscribe(
        offsets => this.offsets = offsets
      )
    );

    this.subs.add(
      this.store$.select(scenesStore.getSelectedPairIds).subscribe(
        pair => this.selectedPair = pair
      )
    );

    this.store$.select(queueStore.getQueuedJobs).subscribe(jobs => {
      const flattened: string[] = [];
        for (const job of jobs) {
          for (const product of job.granules) {
            flattened.push(product.name);
          }
        }

      this.queuedJobs = jobs;
      this.allJobNames = flattened;
    });

    const sortedScenes$ = this.scenesService.sortScenes$(this.scenesService.scenes$());

    this.subs.add(
      this.store$.select(scenesStore.getSelectedScene).pipe(
        withLatestFrom(sortedScenes$),
        /* There is some race condition with scrolling before the list is rendered.
         * Doesn't scroll without the delay even though the function is called.
         * */
        delay(20),
        filter(([selected, _]) => !!selected),
        tap(([selected, _]) => this.selected = selected.id),
        map(([selected, scenes]) => {
          let sceneIdx = -1;
          scenes.forEach((scene, idx) => {
            if (scene.id === selected.id) {
              sceneIdx = idx;
            }
          });
          return Math.max(0, sceneIdx - 1);
        })
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
      sortedScenes$.subscribe(
        scenes => this.scenes = scenes
      )
    );

    this.subs.add(
      this.pairService.pairs$().subscribe(
        pairs => this.pairs = [...pairs.pairs, ...pairs.custom]
      )
    );

    this.subs.add(
      this.scenesService.matchHyp3Jobs$(sortedScenes$).subscribe(
        jobs => this.jobs = jobs
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
              total[scene] = amt[0] >= amt[1];

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

  public onPairSelected(pair): void {
    const action = new scenesStore.SetSelectedPair(pair.map(p => p.id));
    this.store$.dispatch(action);
  }

  public onSceneSelected(id: string): void {
    this.selectedFromList = true;
    this.store$.dispatch(new scenesStore.SetSelectedScene(id));
  }

  public onToggleScene(groupId: string): void {
    if (!this.allQueued[groupId]) {
      this.store$.dispatch(new queueStore.QueueScene(groupId));
    } else {
      this.store$.dispatch(new queueStore.RemoveSceneFromQueue(groupId));
    }
  }

  public onToggleOnDemandScene(job: models.QueuedHyp3Job): void {
    const isJobInQueue = this.queuedJobs.filter(queuedJob =>
      queuedJob.job_type === job.job_type &&
      this.sameGranules(job.granules, queuedJob.granules)
    ).length > 0;

    if (!isJobInQueue) {
      this.store$.dispatch(new queueStore.AddJob(job));
    } else {
      this.store$.dispatch(new queueStore.RemoveJob(job));
    }
  }

  public onAddPairToQueue(pair: models.CMRProductPair): void {
    this.store$.dispatch(new queueStore.AddJob({
      granules: pair,
      job_type: models.Hyp3JobType.INSAR_GAMMA
    }));
  }

  public onSetFocusedScene(scene: models.CMRProduct): void {
    this.hoveredSceneName = scene.name;
  }

  public onClearFocusedScene(): void {
    this.hoveredSceneName = null;
  }

  public onSetFocusedPair(pair: models.CMRProductPair): void {
    this.hoveredPairNames = pair[0].name + pair[1].name;
  }

  public onClearFocusedPair(): void {
    this.hoveredPairNames = null;
  }

  public onZoomTo(scene: models.CMRProduct): void {
    this.mapService.zoomToScene(scene);
  }

  public pairPerpBaseline(pair: models.CMRProductPair) {
    return Math.abs(pair[0].metadata.perpendicular - pair[1].metadata.perpendicular);
  }

  public pairTempBaseline(pair: models.CMRProductPair) {
    return Math.abs(pair[0].metadata.temporal - pair[1].metadata.temporal);
  }

  public sameGranules(granules1: models.CMRProduct[], granules2: models.CMRProduct[]) {
    const ids1 = new Set(granules1.map(granule => granule.id));
    const ids2 = new Set(granules2.map(granule => granule.id));

    return this.eqSet(Array.from(ids1), Array.from(ids2));
  }

  public eqSet(a1: string[], bs: string[]) {
    return a1.length === bs.length && this.all(this.isIn(bs), a1);
  }

  private all(pred, a1: string[]) {
    return a1.every(pred);
  }

  private isIn(a1: string[]) {
    return function (a: string) {
      return a1.includes(a);
    };
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
