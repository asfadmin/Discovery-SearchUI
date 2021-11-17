import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { Download } from 'ngx-operators';
import { DownloadService } from '@services/download.service';
import { CMRProduct } from '@models';
// import {UAParser} from 'ua-parser-js';

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
  public dlComplete = false;
  public url: string;
  public fileName: string;
  public hiddenPrefix = 'xyxHidden-';

  constructor(
    private downloadService: DownloadService,
  ) {}

  ngOnInit(): void {
  }

  ngAfterViewInit() {
  }

  public downloadFile(product: CMRProduct, href?: string) {
    if (this.dlInProgress) {
      return;
    }

    this.dlInProgress = true;

    if (typeof href !== 'undefined') {
      console.log('url', href);
      this.url = href;
      product = null;
      this.fileName = this.url.substring(this.url.lastIndexOf('/') + 1);
    } else {
      this.url = product.downloadUrl;
      this.fileName = product.file;
      console.log('this.url', this.url);
    }

    // UAParser.js - https://www.npmjs.com/package/ua-parser-js
    // JavaScript library to detect Browser, Engine, OS, CPU, and Device type/model from User-Agent data with relatively small footprint
    // const parser = new UAParser();
    // const userAgent = parser.getResult();
    // console.log(userAgent.browser);             // {name: "Chromium", version: "15.0.874.106"}
    // console.log(userAgent.device);              // {model: undefined, type: undefined, vendor: undefined}
    // console.log(userAgent.os);                  // {name: "Ubuntu", version: "11.10"}
    // console.log(userAgent.os.version);          // "11.10"
    // console.log(userAgent.engine.name);         // "WebKit"
    // console.log(userAgent.cpu.architecture);    // "amd64"

    // const megas = window.prompt('How many MBs do you want:');
    // url = 'https://filegen-dev.asf.alaska.edu/generate?bytes=' + megas.trim() + 'e6';
    // url = 'https://filegen-dev.asf.alaska.edu/generate?bytes=10e6';

    // if (userAgent.browser.name !== 'Chrome') {
    if (true) {
      classicDownload(this.url, this.fileName).then( () => {
        this.dlInProgress = false;
        this.dlComplete = true;
        this.productDownloaded.emit( product );
      });
      return;
    }

    this.downloadService.download(this.url, this.fileName).subscribe(resp => {
      this.dFile = resp;
      if (resp.state === 'DONE') {
        this.dlInProgress = false;
        this.dlComplete = true;
        this.productDownloaded.emit( product );
      }
    });
  }

  public hijackDownloadClick( event: MouseEvent, hiddenID ) {
    event.preventDefault();
    console.log(hiddenID);
    this.downloadFile(this.product, this.href);
    // const rClick = new MouseEvent('click');
    // const element = document.getElementById(hiddenID);
    // element.dispatchEvent(rClick);
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
