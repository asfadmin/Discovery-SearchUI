import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { DownloadService } from '@services/download.service';
import { CMRProduct, DownloadStatus } from '@models';
import { UAParser } from 'ua-parser-js';
import { Observable, Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import * as queueStore from '@store/queue';
import { AppState } from '@store';

import * as userStore from '@store/user';
import { SubSink } from 'subsink';
import { AuthService } from '@services';

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
  public subscription: Subscription;

  public isUserLoggedIn: boolean;
  private subs = new SubSink();

  constructor(
    private downloadService: DownloadService,
    private store$: Store<AppState>,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    if (typeof this.href !== 'undefined') {
      this.url = this.href;
      this.product = null;
      const downloadURL = new URL(this.url).pathname;
      this.fileName = downloadURL.substring(downloadURL.lastIndexOf('/') + 1);
    } else {
      this.url = this.product.downloadUrl;
      this.fileName = this.product.file;
    }
    this.subs.add(
      this.store$.select(queueStore.getDownloads).subscribe(
        queueDownloads => {
          if (queueDownloads.hasOwnProperty(this.product?.id ?? this.fileName)) {
            this.dFile = queueDownloads[this.product?.id ?? this.fileName];
          } else {
            this.dFile = null;
            if (this.subscription) {
              this.subscription.unsubscribe();
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
    this.subscription?.unsubscribe();
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
  public downloadFile(dir: boolean = false) {

    if (!this.useNewDownload) {
      this.classicDownload(this.url);
      return;
    }
    if (this.dFile?.state === 'PENDING' || this.dFile?.state === 'IN_PROGRESS') {
      this.cancelDownload();
      this.downloadCancelled.emit(this.product);
      return;
    }



    const userAgent = new UAParser().getResult();

    if (userAgent.browser.name !== 'Chrome') {
      this.classicDownload(this.url);
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
    this.observable$ = this.downloadService.download(this.url, this.fileName, this?.product, product?.id ?? this.fileName, handle);
    this.subscription = this.observable$.subscribe(resp => {
      if (!this.processSubscription(resp, product, true)) {
        this.subscription.unsubscribe();
        // this.observable$ = this.downloadService.download(this.url, this.fileName, this?.product, product?.id ?? this.fileName);
        this.subscription = this.observable$.subscribe(response => this.processSubscription(response, product, false));
      }
    }, () => {
      this.dFile = undefined;
      this.classicDownload(this.url);
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
    link.click();

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
