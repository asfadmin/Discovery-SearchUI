import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import * as FileSaver from 'file-saver';
import * as moment from 'moment';
import { map, withLatestFrom, switchMap, tap, skip } from 'rxjs/operators';

import { AppState } from '../app.reducer';
import {
  QueueActionType, DownloadMetadata, AddItems, RemoveItems,
  RemoveSceneFromQueue, DownloadSearchtypeMetadata,
  AddJob, RemoveJob, AddJobs, ToggleProduct, QueueScene, FindPair, MakeDownloadScriptFromList, MakeDownloadScriptFromSarviewsProducts
} from './queue.action';
import { getDuplicates, getQueuedProducts } from './queue.reducer';
import * as scenesStore from '@store/scenes';

import * as services from '@services';
import * as models from '@models';

export interface MetadataDownload {
  params: {[id: string]: string | null};
  format: models.AsfApiOutputFormat;
}

@Injectable()
export class QueueEffects {
  constructor(
    private actions$: Actions,
    private store$: Store<AppState>,
    private asfApiService: services.AsfApiService,
    private searchParamsService: services.SearchParamsService,
    private bulkDownloadService: services.BulkDownloadService,
    private notificationService: services.NotificationService,
  ) {}

  public makeDownloadScript = createEffect(() => this.actions$.pipe(
    ofType(QueueActionType.MAKE_DOWNLOAD_SCRIPT),
    withLatestFrom(this.store$.select(getQueuedProducts)),
    map(([_, products]) => products),
    switchMap(
      products => this.bulkDownloadService.downloadCMRProductsScript$(products)
    ),
    map(
      req => { FileSaver.saveAs(req.body, req.headers.get('Content-Disposition').slice(20)); }
    )
  ), { dispatch: false });

  public makeDownloadScriptFromList = createEffect(() => this.actions$.pipe(
    ofType<MakeDownloadScriptFromList>(QueueActionType.MAKE_DOWNLOAD_SCRIPT_FROM_LIST),
    map(action => action.payload),
    switchMap(
      (products) => this.bulkDownloadService.downloadCMRProductsScript$(products)
    ),
    map(
      blob => FileSaver.saveAs(blob.body, `download-all-${this.currentDate()}.py`)
    )
  ), { dispatch: false });

  public MakeDownloadScriptFromSarviewsProductsList = createEffect(() => this.actions$.pipe(
    ofType<MakeDownloadScriptFromSarviewsProducts>(QueueActionType.MAKE_DOWNLOAD_SCRIPT_FROM_SARVIEWS_PRODUCTS),
    map(action => action.payload),
    switchMap(products => this.bulkDownloadService.downloadSarviewsProductsScript$(products)),
    map(
      (blob) => FileSaver.saveAs(blob.body, `download-all-${this.currentDate()}.py`)
    )
  ), { dispatch: false });

  public downloadSearchtypeMetadata = createEffect(() => this.actions$.pipe(
    ofType<DownloadSearchtypeMetadata>(QueueActionType.DOWNLOAD_SEARCHTYPE_METADATA),
    map(action => action.payload),
    withLatestFrom(this.searchParamsService.getParams),
    map(
      ([format, searchParams]): MetadataDownload => ({
        params: {
          ...searchParams,
          ...{output: format.toLowerCase()}
        },
        format: format
      })
    ),
    switchMap(
      (search: MetadataDownload) => this.downloadSearch(search)
    ),
  ), { dispatch: false });

  public downloadMetadata = createEffect(() => this.actions$.pipe(
    ofType<DownloadMetadata>(QueueActionType.DOWNLOAD_METADATA),
    map(action => action.payload),
    withLatestFrom(this.store$.select(getQueuedProducts).pipe(
        map(
          products => products
            .map(product => product.id)
            .join(',')
        ),
        map(
          productIds => ({
            product_list: productIds
          })
        )
      )
    ),
    map(
      ([format, params]): MetadataDownload => ({
        params: { ...params, ...{output: format} },
        format
      })
    ),
    switchMap(
      (search: MetadataDownload) => this.downloadSearch(search),
    ),
  ), { dispatch: false });

  public findPair = createEffect(() => this.actions$.pipe(
    ofType<FindPair>(QueueActionType.FIND_PAIR),
  ), { dispatch: false });

  public queueScene = createEffect(() => this.actions$.pipe(
    ofType<QueueScene>(QueueActionType.QUEUE_SCENE),
    withLatestFrom(this.store$.select(scenesStore.getAllSceneProducts)),
    map(([action, sceneProducts]) => sceneProducts[action.payload]),
    map(products => new AddItems(products))
  ));

  public toggleProduct = createEffect(() => this.actions$.pipe(
    ofType<ToggleProduct>(QueueActionType.TOGGLE_PRODUCT),
    withLatestFrom(this.store$.select(getQueuedProducts)),
    map(([action, sceneProducts]) => sceneProducts.includes(action.payload)),
    tap(inQueue => this.notificationService.downloadQueue(inQueue))
  ),
    { dispatch: false }
  );

  public addItems = createEffect(() => this.actions$.pipe(
    ofType<AddItems>(QueueActionType.ADD_ITEMS),
    skip(1),
    tap(act => this.notificationService.downloadQueue(true, act.payload.length)),
  ),
    { dispatch: false }
  );

  public addJob = createEffect(() => this.actions$.pipe(
    ofType<AddJob>(QueueActionType.ADD_JOB),
    withLatestFrom(this.store$.select(getDuplicates)),
    tap(([act, duplicates]) => this.notificationService.demandQueue(true, 1, act.payload.job_type.name, duplicates)),
  ),
    { dispatch: false }
  );

  public addJobs = createEffect(() => this.actions$.pipe(
    ofType<AddJobs>(QueueActionType.ADD_JOBS),
    skip(1),
    map(action => action.payload),
    withLatestFrom(this.store$.select(getDuplicates)),
    map(([jobs, duplicates]) => {
      const jobTypes = Array.from(jobs.reduce((types, job) => types = types.add(job.job_type.name), new Set<string>()));
      this.notificationService.demandQueue(true, jobs.length, jobTypes.length === 1 ? jobTypes[0] : '', duplicates = duplicates);
    }),
  ),
    { dispatch: false }
  );

  public removeJob = createEffect(() => this.actions$.pipe(
    ofType<RemoveJob>(QueueActionType.REMOVE_JOB),
    map(action => action.payload),
    tap(job => this.notificationService.demandQueue(false, 1, job.job_type.name)),
  ),
    { dispatch: false }
  );

  public removeScene = createEffect(() => this.actions$.pipe(
    ofType<RemoveSceneFromQueue>(QueueActionType.REMOVE_SCENE_FROM_QUEUE),
    withLatestFrom(this.store$.select(scenesStore.getAllSceneProducts)),
    map(([action, sceneProducts]) => sceneProducts[action.payload]),
    tap(products => this.notificationService.downloadQueue(false, products.length)),
    map(products => new RemoveItems(products))
  ));

  private downloadSearch(search: MetadataDownload) {
    return this.asfApiService.query<string>(search.params).pipe(
      map(resp => new Blob([resp], { type: 'text/plain'})),
      map(
        blob => FileSaver.saveAs(blob,
          `asf-datapool-results-${this.currentDate()}.${search.format.toLowerCase()}`
        )
      )
    );
  }

  private currentDate(): string {
    return moment().format('YYYY-MM-DD_hh-mm-ss');
  }
}
