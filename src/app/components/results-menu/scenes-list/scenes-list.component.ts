import {
  Component, OnInit, Input, ViewChild, ViewEncapsulation, OnDestroy, AfterContentInit
} from '@angular/core';

import { combineLatest, Observable } from 'rxjs';
import { tap, withLatestFrom, filter, map, delay, debounceTime, first } from 'rxjs/operators';
import { SubSink } from 'subsink';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as searchStore from '@store/search';
import * as scenesStore from '@store/scenes';
import * as queueStore from '@store/queue';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import * as services from '@services';
import * as models from '@models';
import { QueuedHyp3Job, SarviewsEvent } from '@models';

@Component({
  selector: 'app-scenes-list',
  templateUrl: './scenes-list.component.html',
  styleUrls: ['./scenes-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ScenesListComponent implements OnInit, OnDestroy, AfterContentInit {
  @ViewChild(CdkVirtualScrollViewport, { static: true }) scroll: CdkVirtualScrollViewport;
  @Input() resize$: Observable<void>;

  public scenes;
  public pairs;
  public jobs;
  public sarviewsEvents: SarviewsEvent[];

  public numberOfQueue: { [scene: string]: number };
  public allQueued: { [scene: string]: boolean };
  public allJobNames: string[];
  public queuedJobs: QueuedHyp3Job[];
  public selected: string;
  public selectedEvent: string;

  public hyp3ableByScene: { [scene: string]: { byJobType: models.Hyp3ableProductByJobType[], total: number } } = {};

  public offsets = { temporal: 0, perpendicular: 0 };
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
    private hyp3: services.Hyp3Service,
    private eventMonitoringService: services.SarviewsEventsService,
  ) { }

  ngOnInit() {
    this.keyboardService.init();

    this.subs.add(
      this.store$.select(scenesStore.getMasterOffsets).subscribe(
        offsets => this.offsets = offsets
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
      this.store$.select(scenesStore.getSelectedSarviewsEvent).pipe(
        withLatestFrom(this.eventMonitoringService.filteredSarviewsEvents$()),
        delay(20),
        filter(([selected, _]) => !!selected),
        tap(([selected, _]) => this.selectedEvent = selected.event_id),
        map(([selected, events]) => {
          const sceneIdx = events.findIndex(event => event.event_id === selected.event_id);
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
      sortedScenes$.pipe(debounceTime(250)).subscribe(
        scenes => {
          this.scenes = scenes;
        }
      )
    );

    this.subs.add(
      this.eventMonitoringService.filteredSarviewsEvents$().pipe(
        filter(_ => this.searchType === this.SearchTypes.SARVIEWS_EVENTS),
      ).subscribe(
        events => {
          this.sarviewsEvents = events;

          const eventIds = events.map(event => event.event_id);
          if (!eventIds.includes(this.selectedEvent) && eventIds.length > 0 && !!this.selectedEvent) {
            this.store$.dispatch(new scenesStore.SetSelectedSarviewsEvent(eventIds[0]));
          }
        }
      )
    );

    this.subs.add(
      this.pairService.pairs$().pipe(debounceTime(250)).subscribe(
        pairs => {
          this.pairs = [...pairs.pairs, ...pairs.custom].map(
            pair => {
              const hyp3able = this.hyp3.getHyp3ableProducts([pair, ...pair.map(p => [p])]);

              return {
                pair,
                hyp3able
              };
            }
          );
        }
      )
    );

    this.subs.add(
      this.store$.select(searchStore.getSearchType).subscribe(
        searchType => this.searchType = searchType
      )
    );


    this.store$.select(scenesStore.getAllSceneProducts).subscribe(
      searchScenes => {
        this.hyp3ableByScene = {};
        Object.entries(searchScenes).forEach(([groupId, products]) => {
          const hyp3able = this.hyp3.getHyp3ableProducts(
            (<models.CMRProduct[]>products).map(product => [product])
          );


          this.hyp3ableByScene[groupId] = hyp3able;
        });
      }
    );

    const queueScenes$ = combineLatest(
      this.store$.select(queueStore.getQueuedProducts),
      this.store$.select(scenesStore.getAllSceneProducts),
    ).pipe(
      debounceTime(0),
      map(([queueProducts, searchScenes]) => {

        const queuedProductGroups: { [id: string]: string[] } = queueProducts.reduce((total, product) => {
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

    this.subs.add(
      this.store$.select(scenesStore.getSelectedPair).pipe(
        withLatestFrom(this.pairService.pairs$()),
        delay(20),
        filter(([selected, _]) => !!selected),
        map(([selected, pairs]) => {
          let pairsCombined = [...pairs.pairs, ...pairs.custom] 
          const sceneIdx = pairsCombined.findIndex(pair => pair[0] === selected[0] && pair[1] === selected[1]);
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

  }

  ngAfterContentInit() {
    this.subs.add(this.eventMonitoringService.filteredSarviewsEvents$().pipe(
      filter(loaded => !!loaded),
      withLatestFrom(this.store$.select(scenesStore.getSelectedSarviewsEvent)),
      map(([events, selected]) => ({ selectedEvent: selected, events })),
      delay(400),
      filter(selected => !!selected.selectedEvent),
      tap(selected => {
        this.mapService.zoomToEvent(selected.selectedEvent);
        this.selectedEvent = selected.selectedEvent.event_id;
      }),
      first(),
      map(selected => {
        const sceneIdx = selected.events.findIndex(event => event.event_id === selected.selectedEvent.event_id);
        return Math.max(0, sceneIdx - 1);
      })
    ).subscribe(
      idx => {
        if (!this.selectedFromList) {
          this.scrollTo(idx);
        }
      }
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
  public onPairSelected(pair: string[]) {
    this.selectedFromList = true;
    this.store$.dispatch(new scenesStore.SetSelectedPair(pair));
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

  public onAddInSarJob(pair: models.CMRProductPair): void {
    this.store$.dispatch(new queueStore.AddJob({
      granules: pair,
      job_type: models.hyp3JobTypes.INSAR_GAMMA
    }));
  }

  public onAddAutoRiftJob(pair: models.CMRProductPair): void {
    this.store$.dispatch(new queueStore.AddJob({
      granules: pair,
      job_type: models.hyp3JobTypes.AUTORIFT
    }));
  }

  public onZoomTo(scene: models.CMRProduct): void {
    this.mapService.zoomToScene(scene);
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
