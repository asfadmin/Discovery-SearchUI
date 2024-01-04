import {
  Component, OnInit, Input, ViewChild, ViewEncapsulation, OnDestroy, AfterContentInit
} from '@angular/core';

import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import {
  tap, withLatestFrom, filter, map, delay, debounceTime,
  first, distinctUntilChanged,
} from 'rxjs/operators';
import { SubSink } from 'subsink';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as searchStore from '@store/search';
import * as scenesStore from '@store/scenes';
import * as queueStore from '@store/queue';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import * as services from '@services';
import * as models from '@models';
import { CMRProduct, QueuedHyp3Job, SarviewsEvent } from '@models';

@Component({
  selector: 'app-scenes-list',
  templateUrl: './scenes-list.component.html',
  styleUrls: ['./scenes-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ScenesListComponent implements OnInit, OnDestroy, AfterContentInit {
  @ViewChild(CdkVirtualScrollViewport, { static: true }) scroll: CdkVirtualScrollViewport;
  @Input() resize$: Observable<void>;
  private pairs$ = this.pairService.pairs$;

  public scenes: CMRProduct[];
  public pairs: {
    pair: models.CMRProductPair;
    hyp3able: {
      byJobType: models.Hyp3ableProductByJobType[];
      total: number;
    };
  }[];
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

  private productPageSize = 250;
  private numberProductsInList$ = new BehaviorSubject(this.productPageSize);
  public numberProductsInList: number;

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

    this.subs.add(
      this.store$.select(searchStore.getSearchType).subscribe(
        searchType => this.searchType = searchType
      )
    );

    const scenes$ = this.scenesService.scenes$;
    const sortedScenes$: Observable<CMRProduct[]> = this.scenesService.sortScenes$(scenes$);
    const sortedScenesWithDelay$ = sortedScenes$.pipe(
      debounceTime(250),
      distinctUntilChanged(),
    );

    this.setupCustomProductsSubscriptions();

    this.subs.add(
      sortedScenesWithDelay$.subscribe(
          scenes => {
            this.scenes = scenes;

            this.loadDummyProducts(scenes);
          }
        )
    );

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
      this.pairs$.subscribe(
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

    const baselineReference$ = combineLatest([
      this.store$.select(scenesStore.getScenes),
      this.store$.select(scenesStore.getMasterName),
      this.store$.select(searchStore.getSearchType)
    ]).pipe(
      map(
        ([scenes, referenceName, searchType]) => {
          if (searchType === models.SearchType.BASELINE && !!referenceName) {
            const referenceSceneIdx = scenes.findIndex(scene => scene.name === referenceName);

            if (referenceSceneIdx !== -1) {
              return scenes[referenceSceneIdx];
            }
          } else {
            return null;
          }
        }
      ),
    );

    this.store$.select(scenesStore.getAllSceneProducts).pipe(
      withLatestFrom(baselineReference$)
    ).subscribe(
        ([searchScenes, baselineReference]) => {
          this.hyp3ableByScene = {};

          Object.entries(searchScenes).forEach(([groupId, products]) => {
            const possibleJobs = [];
            (<any[]>products).forEach(product => {

              possibleJobs.push([product]);

              if (!!baselineReference) {
                possibleJobs.push([baselineReference, product]);
              }
            });

            const hyp3able = this.hyp3.getHyp3ableProducts(possibleJobs);

            this.hyp3ableByScene[groupId] = hyp3able;
          });
        }
      );

    const queueScenes$ = combineLatest([
      this.store$.select(queueStore.getQueuedProducts),
      this.store$.select(scenesStore.getAllSceneProducts),]
    ).pipe(
      debounceTime(0),
      map(([queueProducts, searchScenes]) => {

        const queuedProductGroups: { [id: string]: string[] } = queueProducts.reduce((total, product) => {
          const groupCriteria = this.getGroupCriteria(product)
          const scene = total[groupCriteria] || [];

          total[groupCriteria] = [...scene, product.id];
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
        withLatestFrom(this.pairs$),
        delay(20),
        filter(([selected, _]) => !!selected),
        map(([selected, pairs]) => {
          const pairsCombined = [...pairs.pairs, ...pairs.custom];
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
      ));

    this.subs.add(this.pairs$.pipe(
      filter(loaded => !!loaded),
      withLatestFrom(this.store$.select(scenesStore.getSelectedPair)),
      map(([pairs, selected]) => ({ selectedPair: selected, pairs })),
      delay(400),
      filter(selected => !!selected.selectedPair),
      first(),
      map(selected => {
        const pairsCombined = [...selected.pairs.pairs, ...selected.pairs.custom];
        const sceneIdx = pairsCombined.findIndex(pair => pair[0] === selected.selectedPair[0] && pair[1] === selected.selectedPair[1]);
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

  public onToggleScene(groupCriteria: string): void {
    if (!this.allQueued[groupCriteria]) {
      this.store$.dispatch(new queueStore.QueueScene(groupCriteria));
    } else {
      this.store$.dispatch(new queueStore.RemoveSceneFromQueue(groupCriteria));
    }
  }

  public getGroupCriteria(scene: CMRProduct): string {
    const ungrouped_product_types = [...models.opera_s1.productTypes, {apiValue: 'BURST'}, {apiValue: 'BURST_XML'}].map(m => m.apiValue)
    if(ungrouped_product_types.includes(scene.metadata.productType)) {
      return scene.metadata.parentID || scene.id;
    }
    return scene.groupId;
  }

  public onLoadMoreCustomProducts() {
    const oldNumProducts = this.numberProductsInList;
    const newNumProducts = this.numberProductsInList + this.productPageSize;

    const scenesToLoad = this.scenes.slice(oldNumProducts, newNumProducts);

    this.store$.dispatch(new searchStore.LoadOnDemandScenesList(scenesToLoad));

    this.numberProductsInList$.next(
      newNumProducts
    );
  }

  private setupCustomProductsSubscriptions() {
    this.subs.add(
      combineLatest([
        this.numberProductsInList$,
        this.store$.select(searchStore.getSearchType)
      ]).subscribe(
        ([num, searchType]) => {
            if (searchType === models.SearchType.CUSTOM_PRODUCTS) {
              this.numberProductsInList = num;
            } else {
              this.numberProductsInList = 2^50;
            }
          }
      )
    );
  }

  private loadDummyProducts(scenes: CMRProduct[]) {
    const scenesToLoad = scenes
      .slice(0, this.numberProductsInList)
      .filter(s => s.isDummyProduct);

    if (scenesToLoad.length === 0) {
      return;
    }

    this.store$.dispatch(new searchStore.LoadOnDemandScenesList(scenesToLoad));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
