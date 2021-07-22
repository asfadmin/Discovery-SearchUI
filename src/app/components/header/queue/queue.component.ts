import {Component, OnInit, OnDestroy, Input} from '@angular/core';

import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { ClipboardService } from 'ngx-clipboard';
import { map, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as queueStore from '@store/queue';

import { NotificationService, ScreenSizeService } from '@services';
import { CMRProduct, AsfApiOutputFormat, Breakpoints } from '@models';
import { MatDialogRef } from '@angular/material/dialog';
import { SubSink } from 'subsink';
import { ResizedEvent } from 'angular-resize-event';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { Observable } from 'rxjs';
import { download, Download } from 'ngx-operators';
// import { DownloadService } from '@services/download.service';


// tslint:disable-next-line:class-name
export interface selectedItems {
  id: string;
  url: string;
}

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.scss']
})
export class QueueComponent implements OnInit, OnDestroy {

  @Input() appQueueComponentModel: string;

  download$: Observable<Download>;
  // public dFile: Download;
  // public dlInProgress: boolean = false;

  public queueHasOnDemandProducts = false;
  public showDemWarning: boolean;

  public copyIcon = faCopy;
  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = Breakpoints;
  public breakpoint: Breakpoints;

  public previousQueue: any[] | null = null;
  public areAnyProducts = false;

  public style: object = {};
  public dlWidth = 1000;
  public dlHeight = 1000;
  public dlWidthMin = 715;

  public selectedItems: selectedItems[] = [];
  public allChecked = false;
  public someChecked = false;

  public products$ = this.store$.select(queueStore.getQueuedProducts).pipe(
    tap(products => this.areAnyProducts = products.length > 0),
    tap(products => {
      this.queueHasOnDemandProducts = !products.every(product => !product.metadata.job);
      this.showDemWarning = (this.areAnyProducts) ? this.demWarning((products)) : false;
    })
  );

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
    private notificationService: NotificationService,
    private http: HttpClient,
    // private downloadService: DownloadService,
  ) {}

  ngOnInit() {
    this.subs.add(
      this.screenSize.breakpoint$.subscribe(
        breakpoint => this.breakpoint = breakpoint
      )
    );
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
      .filter(product => !product.isUnzippedFile)
      .map(product => product.id)
      .join('\n');
    this.clipboardService.copyFromContent(productListStr);
    const lines = this.lineCount(productListStr);
    this.notificationService.clipboardCopyQueue(lines, true);

  }

  public onCopyQueueURLs(products: CMRProduct[]): void {
    const productListStr = products
      .filter(product => !product.isUnzippedFile)
      .map(product => product.downloadUrl)
      .join('\n');
    this.clipboardService.copyFromContent(productListStr);
    const lines = this.lineCount(productListStr);
    this.notificationService.clipboardCopyQueue(lines, false);
  }

  private lineCount( str: string ) {
    let length = 1;
    for ( let i = 0; i < str.length; ++i ) {
      if ( str[i] === '\n') {
        length++;
      }
    }
    return length;
  }

  private downloadMetadata(format: AsfApiOutputFormat): void {
    this.store$.dispatch(new queueStore.DownloadMetadata(format));
  }

  // public downloadFile(url: string, filename: string) {
  //   if (this.dlInProgress) { return; }
  //   this.dlInProgress = true;
  //   this.downloadService.download(url, filename).subscribe( resp => {
  //     this.dFile = resp;
  //     if (resp.state === 'DONE') { this.dlInProgress = false; }
  //     console.log ('download in progress:', this.dlInProgress, 'resp:', resp);
  //   });
  // }

  public toggleItemSelected(productId, downloadUrl) {
    const idx = this.selectedItems.findIndex( o => o.id === productId );
    if (idx > -1) {
      this.selectedItems.splice( idx, 1 );
    } else {
      this.selectedItems.push({
        id: productId,
        url: downloadUrl,
      });
    }
    if ( this.selectedItems.length > 0 ) {
        this.someChecked = true;
      }
    console.log('itemSelected:', this.selectedItems);
  }

  public demWarning(products) {
    if (!products) {
      return false;
    }

    return products.filter(product => product.metadata.productType !== null)
    .some(product => product.dataset === 'ALOS' &&
        product.metadata.productType.includes('RTC_')
      );
  }

  public onResized(event: ResizedEvent) {
    this.dlWidth = event.newWidth;
    this.dlHeight = event.newHeight;
  }

  public download(href) {
    console.log('href:', href);
    this.download$ = this.http.get(href, {
      withCredentials: true,
      reportProgress: true,
      observe: 'events',
      responseType: 'blob'
    }).pipe(download(() => saveAs('special.nc')));
  }

  onCloseDownloadQueue() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
