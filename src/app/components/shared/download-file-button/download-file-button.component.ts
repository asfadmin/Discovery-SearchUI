import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { DownloadService } from '@services/download.service';
import { CMRProduct, DownloadStatus } from '@models';
import { UAParser } from 'ua-parser-js';
import {
  Observable, Subscription,
  catchError,
  concatMap,
  filter,
  first,
  interval,
  // switchMap,
  takeWhile,
} from 'rxjs';

import { Store } from '@ngrx/store';
import * as queueStore from '@store/queue';
import { AppState } from '@store';

import * as userStore from '@store/user';
import { SubSink } from 'subsink';
import { AuthService, NotificationService } from '@services';
import {
  HttpClient, HttpEventType,
} from '@angular/common/http';

@Component({
  selector: 'app-download-file-button',
  templateUrl: './download-file-button.component.html',
  styleUrls: ['./download-file-button.component.scss']
})
export class DownloadFileButtonComponent implements OnInit, AfterViewInit {
  @Input() product: CMRProduct;
  @Input() href: string;
  @Input() disabled: boolean;
  @Input() useNewDownload: boolean;
  @Output()
  productDownloaded: EventEmitter<CMRProduct> = new EventEmitter<CMRProduct>();
  @Output() downloadCancelled: EventEmitter<CMRProduct> = new EventEmitter<CMRProduct>();
  public dFile: DownloadStatus;
  public url: string;
  public fileName: string = null;

  public observable$: Observable<DownloadStatus>;
  public downloadSubscription: Subscription;
  public burstSubscription: Subscription;
  public isUserLoggedIn: boolean;
  private subs = new SubSink();

  constructor(
    private downloadService: DownloadService,
    private store$: Store<AppState>,
    private authService: AuthService,
    private http: HttpClient,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    if (typeof this.href !== 'undefined') {
      this.url = this.href;
      this.product = null;
      const downloadURL = new URL(this.url).pathname;
      this.fileName = downloadURL.substring(downloadURL.lastIndexOf('/') + 1);
    } else {
      this.url = this.product.downloadUrl;
      this.fileName = this.product.metadata.fileName ?? this.product.file;
      if (this.product.productTypeDisplay.endsWith('GeoTIFF') && !this.fileName.endsWith('tif')) {
        this.fileName += '.tif';
      }
    }
    this.subs.add(
      this.store$.select(queueStore.getDownloads).subscribe(
        queueDownloads => {
          if (queueDownloads.hasOwnProperty(this.product?.id ?? this.fileName)) {
            this.dFile = queueDownloads[this.product?.id ?? this.fileName];
          } else {
            this.dFile = null;
            if (this.downloadSubscription) {
              this.downloadSubscription.unsubscribe();
            }
          }
        }
      )
    );
  }

  ngAfterViewInit() {
    this.subs.add(
      this.store$.select(userStore.getIsUserLoggedIn).subscribe(
        isLoggedIn => this.isUserLoggedIn = isLoggedIn
      )
    );
  }
  public cancelDownload() {
    this.downloadSubscription?.unsubscribe();
    this.burstSubscription?.unsubscribe();
    this.store$.dispatch(new queueStore.RemoveDownloadProduct(this.dFile));
    this.dFile = null;
  }
  public getHandle(dir: boolean = false) {
    return new Promise(resolve => {
      if (dir) {
        this.downloadService.getDirectory().then((handle) => {
          resolve(handle);
        });
      } else {
        this.downloadService.getFileHandle(this.fileName).then(handle => {
          resolve(handle);
        });
      }
    });

  }

  private onAccountButtonClicked() {
    this.subs.add(
      this.authService.login$().pipe(
        first(),
        filter(user => !!user)
      ).subscribe(
        user => {
          this.store$.dispatch(new userStore.Login(user));
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            'event': 'account-button-clicked',
            'account-button-clicked': user
          });
        }
      )
    );
  }

  public downloadFile(dir: boolean = false) {
    const isBurstProduct = !!['BURST', 'BURST_XML'].find(t => t === this.product.metadata.productType);
    if (!this.isUserLoggedIn && isBurstProduct) {
      this.onAccountButtonClicked();
      return;
    }
    if (this.dFile?.state === 'PENDING' || this.dFile?.state === 'IN_PROGRESS') {
      this.cancelDownload();
      this.downloadCancelled.emit(this.product);
      return;
    }
    if (!this.useNewDownload) {
      if (isBurstProduct) {
        this.burstFunctionality(this.product);
      }
      else {
        this.classicDownload(this.url);
      }
      return;
    }


    const userAgent = new UAParser().getResult();

    if (userAgent.browser.name !== 'Chrome') {
      if (isBurstProduct) {
        this.burstFunctionality(this.product);
      }
      else {
        this.classicDownload(this.url);
      }
      return;
    }

    if (!this.isUserLoggedIn) {
      this.getHandle(dir).then(handle => {
        this.subs.add(
          this.authService.login$().subscribe(
            user => {
              this.store$.dispatch(new userStore.Login(user));
              this.downloadFunctionality(this.product, handle);
            }));
      });
    } else {
      this.getHandle(dir).then(handle => {
        this.downloadFunctionality(this.product, handle);
      });
    }
  }
  private downloadFunctionality(product: CMRProduct, handle: any) {
    const initStatus: DownloadStatus = {
      progress: 0,
      state: 'PENDING',
      id: this.product?.id ?? this.fileName,
      filename: '',
      product: this?.product,
    };
    this.store$.dispatch(new queueStore.DownloadProduct(initStatus));

    if (!!['BURST', 'BURST_XML'].find(t => t === this.product.metadata.productType)) {
      this.burstFunctionality(product, handle);
    }
    else {
      this.startDownload(product, handle);
    }
  }
  private burstFunctionality(product: CMRProduct, handle?: any) {
    const initStatus: DownloadStatus = {
      progress: 0,
      state: 'PENDING',
      id: this.product?.id ?? this.fileName,
      filename: '',
      product: this?.product,
    };
    this.store$.dispatch(new queueStore.DownloadProduct(initStatus));

    this.burstSubscription = interval(2000).pipe(
      concatMap(() => this.http.get(this.url, {
        withCredentials: true,
        observe: 'events',
        reportProgress: true,
      })),
      takeWhile((res: any) => {
        if (this.isBurstDone(res, this.product)) {
          if (handle) {
            this.startDownload(product, handle);
          } else {
            this.classicDownload(this.url);
          }
          this.burstSubscription.unsubscribe();
          return false;
        } else {
          
        if(!this.downloadService.hasDownloadedBursts && !handle) {
          this.downloadService.hasDownloadedBursts = true;
          this.notificationService.info('You may need to enable popups on this site due to needing to extract the burst before downloading.', 'Burst Extraction');
        }
        }
        return true;
      }),
      catchError(err => {
        console.log(err)
        return err;
      })
    ).subscribe()
  }
  private isBurstDone(resp, _product): boolean {
    if (resp.type === HttpEventType.DownloadProgress || resp.type === HttpEventType.DownloadProgress) {
      return resp.loaded > 1000;
    }
    return false;
  }
  private startDownload(product: CMRProduct, handle: any) {
    this.observable$ = this.downloadService.download(this.url, this.fileName, this?.product, product?.id ?? this.fileName, handle);
    this.downloadSubscription = this.observable$.subscribe(
      {
        next: resp => {
          if (!this.processSubscription(resp, product, true)) {
            this.downloadSubscription.unsubscribe();
            this.downloadSubscription = this.observable$.subscribe(response => this.processSubscription(response, product, false));
          }
        },
        error: () => {
          this.dFile = undefined;
          this.classicDownload(this.url);
        }
      });
  }

  private processSubscription(resp, product, headerOnly) {
    this.dFile = resp;
    this.store$.dispatch(new queueStore.DownloadProduct(resp));
    if (resp.state === 'PENDING') {
      this.fileName = resp.filename;
      if (headerOnly && this.fileName) {
        return false;
      }
    }
    if (resp.state === 'SAVING') {
      this.productDownloaded.emit(product);
    }

    return true;
  }

  public hijackDownloadClick(event: MouseEvent) {
    event.preventDefault();
    this.downloadFile();
  }
  async classicDownload(url) {

    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.setAttribute('download', '');
    // link.type = 'blob';
    link.target = '_blank';

    // It needs to be added to the DOM so it can be clicked
    document.body.appendChild(link);
    if (this.product.metadata.productType === 'BURST' || this.product.metadata.productType === 'BURST_XML') {
      window.location.href = url;
    } else {
      link.click();
    }

    // To make this work we need to wait
    // a little while before removing it.
    await timer(1000);
    URL.revokeObjectURL(link.href);
    link.parentNode.removeChild(link);

    this.dFile = {
      progress: 100,
      state: 'DONE',
      id: this.product.id,
      filename: this.fileName,
      product: this.product
    };
    this.store$.dispatch(new queueStore.DownloadProduct(this.dFile));

  }
}

function timer(ms) { return new Promise(res => setTimeout(res, ms)); }