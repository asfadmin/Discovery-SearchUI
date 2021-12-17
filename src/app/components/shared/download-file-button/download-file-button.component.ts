import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { Download } from 'ngx-operators';
import { DownloadService } from '@services/download.service';
import { CMRProduct } from '@models';
import { UAParser } from 'ua-parser-js';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-download-file-button',
  templateUrl: './download-file-button.component.html',
  styleUrls: ['./download-file-button.component.scss']
})
export class DownloadFileButtonComponent implements OnInit, AfterViewInit {
  @Input() product: CMRProduct;
  @Input() href: string;
  @Output()
  productDownloaded: EventEmitter<CMRProduct> = new EventEmitter<CMRProduct>();
  public dFile: Download;
  public dlInProgress = false;
  public dlPaused = false;
  public dlComplete = false;
  public url: string;
  public fileName: string = null;
  public hiddenPrefix = 'xyxHidden-';

  public observable$: Observable<Download>;
  public subscription: Subscription;

  constructor(
    private downloadService: DownloadService,
  ) {}

  ngOnInit(): void {
  }

  ngAfterViewInit() {
  }

  public downloadFile(product: CMRProduct, href?: string) {
    if (this.dlInProgress) {
      this.subscription.unsubscribe();
      this.dlPaused = true;
      this.dlInProgress = false;
      return;
    } else {
      this.dlPaused = false;
    }

    this.dlInProgress = true;

    if (typeof href !== 'undefined') {
      this.url = href;
      product = null;
      const downloadURL = new URL(this.url).pathname;
      this.fileName = downloadURL.substring(downloadURL.lastIndexOf('/') + 1);

    } else {
      this.url = product.downloadUrl;
      this.fileName = product.file;
    }

    const userAgent = new UAParser().getResult();

    if (userAgent.browser.name !== 'Chrome') {
      classicDownload(this.url, this.fileName).then( () => {
        this.dlInProgress = false;
        this.dlComplete = true;
        this.productDownloaded.emit( product );
      });
      return;
    }


    this.observable$ = this.downloadService.download(this.url, this.fileName);
    this.subscription = this.observable$.subscribe( resp => {
      if (!this.processSubscription(resp, product, true)) {
        console.log('processSubscription() unsubscribing now');
        this.subscription.unsubscribe();
        console.log('Now subscribing with the filename from the header:', this.fileName);
        console.log('And the url:', this.url);
        this.observable$ = this.downloadService.download(this.url, this.fileName);
        this.subscription = this.observable$.subscribe( response => this.processSubscription(response, product, false));
      }
    });


  }

  private processSubscription(resp, product, headerOnly) {
    this.dFile = resp;

    if (resp.state === 'PENDING') {
      this.fileName = resp.id;
      if (headerOnly && this.fileName) {
        return false;
      }
    }

    if (resp.state === 'DONE') {
      this.dlInProgress = false;
      this.dlComplete = true;
      this.productDownloaded.emit(product);
    }

    return true;
  }

  public hijackDownloadClick( event: MouseEvent ) {
    event.preventDefault();
    this.downloadFile( this.product, this.href );
  }

}

async function classicDownload( url, _filename ) {
  const link = document.createElement('a');

  link.style.display = 'none';
  link.href = url;
  link.setAttribute('download', '');
  link.type = 'blob';
  link.target = '_blank';
  // const re = /(?:\.([^.]+))?$/;
  // const ext = re.exec(url)[1];
  // (ext.toUpperCase() === 'XML') ? link.target = '_blank' : link.target = '_self';

  // It needs to be added to the DOM so it can be clicked
  document.body.appendChild(link);
  link.click();

  // To make this work we need to wait
  // a little while before removing it.
  await timer(1000);
  URL.revokeObjectURL(link.href);
  link.parentNode.removeChild(link);
}

function timer(ms) { return new Promise(res => setTimeout(res, ms)); }
