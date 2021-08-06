import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Download } from 'ngx-operators';
import { DownloadService } from '@services/download.service';
import { CMRProduct } from '@models';

@Component({
  selector: 'app-download-file-button',
  templateUrl: './download-file-button.component.html',
  styleUrls: ['./download-file-button.component.scss']
})
export class DownloadFileButtonComponent implements OnInit {
  @Input() product: CMRProduct;
  @Input() href: string;
  @Output()
  productDownloaded: EventEmitter<CMRProduct> = new EventEmitter<CMRProduct>();
  public dFile: Download;
  public dlInProgress = false;
  public dlComplete = false;
  public url: string;
  public fileName: string;

  constructor(
    private downloadService: DownloadService,
  ) {}

  ngOnInit(): void {
  }

  public downloadFile(product: CMRProduct, href?: string) {
    if (this.dlInProgress) {
      return;
    }

    this.dlInProgress = true;

    console.log('href:', href);
    // if an href is passed then the product ignored
    // if (href) {
    //   this.url = href;
    //   this.fileName = this.url.substring(this.url.lastIndexOf('/') + 1);
    // } else {
      this.url = product.downloadUrl;
      this.fileName = product.file;
    // }

    this.downloadService.download(this.url, this.fileName).subscribe(resp => {
      this.dFile = resp;
      if (resp.state === 'DONE') {
        this.dlInProgress = false;
        this.dlComplete = true;
        this.productDownloaded.emit( product );
      }
    });
  }
}
