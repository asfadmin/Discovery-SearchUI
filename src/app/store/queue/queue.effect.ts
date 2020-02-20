import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';

import * as FileSaver from 'file-saver';
import * as moment from 'moment';

import { Observable } from 'rxjs';
import { map, withLatestFrom, switchMap } from 'rxjs/operators';

import { AppState } from '../app.reducer';
import { QueueActionType, DownloadMetadata, QueueScene, AddItems, RemoveItems, RemoveSceneFromQueue } from './queue.action';
import { getQueuedProducts } from './queue.reducer';
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
    private searchParams$: services.SearchParamsService,
    private asfApiService: services.AsfApiService,
    private bulkDownloadService: services.BulkDownloadService,
  ) {}

  private makeDownloadScript = createEffect(() => this.actions$.pipe(
    ofType(QueueActionType.MAKE_DOWNLOAD_SCRIPT),
    withLatestFrom(this.store$.select(getQueuedProducts)),
    map(([action, products]) => products),
    switchMap(
      products => this.bulkDownloadService.downloadScript$(products)
    ),
    map(
      blob => FileSaver.saveAs(blob, `download-all-${this.currentDate()}.py`)
    )
  ), { dispatch: false });

  private downloadMetadata = createEffect(() => this.actions$.pipe(
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
      (search: MetadataDownload) => this.asfApiService.query<string>(search.params).pipe(
        map(resp => new Blob([resp], { type: 'text/plain'})),
        map(
          blob => FileSaver.saveAs(blob,
            `asf-datapool-results-${this.currentDate()}.${search.format.toLowerCase()}`
          )
        )
      ),
    ),
  ), { dispatch: false });

  private queueScene = createEffect(() => this.actions$.pipe(
    ofType<QueueScene>(QueueActionType.QUEUE_SCENE),
    withLatestFrom(this.store$.select(scenesStore.getAllSceneProducts)),
    map(([action, sceneProducts]) => sceneProducts[action.payload]),
    map(products => new AddItems(products))
  ));

  private removeScene = createEffect(() => this.actions$.pipe(
    ofType<RemoveSceneFromQueue>(QueueActionType.REMOVE_SCENE_FROM_QUEUE),
    withLatestFrom(this.store$.select(scenesStore.getAllSceneProducts)),
    map(([action, sceneProducts]) => sceneProducts[action.payload]),
    map(products => new RemoveItems(products))
  ));

  private currentDate(): string {
    return moment().format('YYYY-MM-DD_hh-mm-ss');
  }
}
