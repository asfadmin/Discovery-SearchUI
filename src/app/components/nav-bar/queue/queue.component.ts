import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';

import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { ClipboardService } from 'ngx-clipboard';
import { map, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as queueStore from '@store/queue';

import { ScreenSizeService } from '@services';
import { CMRProduct, AsfApiOutputFormat } from '@models';
import { MatDialogRef } from '@angular/material';

import { SubSink } from 'subsink';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.scss']
})
export class QueueComponent implements OnInit, OnDestroy {
  public products$ = this.store$.select(queueStore.getQueuedProducts).pipe(
    tap(products => this.areAnyProducts = products.length > 0)
  );

  private productNameLen: number;

  public copyIcon = faCopy;

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

  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    private clipboardService: ClipboardService,
    private dialogRef: MatDialogRef<QueueComponent>,
    private screenSize: ScreenSizeService,
  ) {}

  ngOnInit() {
    const productNameLengthSub = this.screenSize.size$.pipe(
      map(size => size.width > 1000 ? 48 : 16)
    ).subscribe(len => this.productNameLen = len);

    this.subs.add(productNameLengthSub);
  }

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

  public onCopyQueue(products: CMRProduct[]): void {
    const productListStr = products
      .map(product => product.id)
      .join(',');

    this.clipboardService.copyFromContent(productListStr);
  }

  private downloadMetadata(format: AsfApiOutputFormat): void {
    this.store$.dispatch(new queueStore.DownloadMetadata(format));
  }

  onCloseDownloadQueue() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
