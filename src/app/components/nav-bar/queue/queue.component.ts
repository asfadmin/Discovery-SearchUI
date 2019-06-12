import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { map, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as queueStore from '@store/queue';

import { CMRProduct, AsfApiOutputFormat } from '@models';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.scss']
})
export class QueueComponent {
  public products$ = this.store$.select(queueStore.getQueuedProducts).pipe(
    tap(products => this.areAnyProducts = products.length > 0)
  );

  public previousQueue: any[] | null = null;
  public areAnyProducts = false;

  public numberOfProducts$ = this.products$.pipe(
    map(products => products.length)
  );
  public totalSize$ = this.products$.pipe(
    map(products => products.reduce(
      (total, product) => total + product.bytes,
      0
    ))
  );

  constructor(private store$: Store<AppState>,
              private dialogRef: MatDialogRef<QueueComponent>,
) {}

  public onRemoveProduct(product: CMRProduct): void {
    this.store$.dispatch(new queueStore.RemoveItem(product));
  }

  public onClearQueue(products: any[]): void {
    this.previousQueue = products;

    this.store$.dispatch(new queueStore.ClearQueue());
  }

  public onRestoreQueue(previousProducts): void {
    this.store$.dispatch(new queueStore.AddItems(previousProducts));
    this.previousQueue = null;
  }

  public onMakeDownloadScript(): void {
    this.store$.dispatch(new queueStore.MakeDownloadScript());
  }

  public onCsvDownload(): void {
    this.downloadMetadata(AsfApiOutputFormat.CSV);
  }

  public onKmlDownload(): void {
    this.downloadMetadata(AsfApiOutputFormat.KML);
  }

  public onGeojsonDownload(): void {
    this.downloadMetadata(AsfApiOutputFormat.GEOJSON);
  }

  public onMetalinkDownload(): void {
    this.downloadMetadata(AsfApiOutputFormat.METALINK);
  }

  private downloadMetadata(format: AsfApiOutputFormat): void {
    this.store$.dispatch(new queueStore.DownloadMetadata(format));
  }

  onCloseDownloadQueue() {
    this.dialogRef.close();
  }
}
