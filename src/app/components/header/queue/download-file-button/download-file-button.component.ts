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
  @Output()
  productDownloaded: EventEmitter<CMRProduct> = new EventEmitter<CMRProduct>();
  public dFile: Download;
  public dlInProgress = false;
  public dlComplete = false;

  constructor(
    private downloadService: DownloadService,
  ) {}

  ngOnInit(): void {
  }

  public downloadFile(product: CMRProduct) {
    if (this.dlInProgress) {
      return;
    }
    this.dlInProgress = true;
    const url = product.downloadUrl;
    const fileName = product.file;
    this.downloadService.download(url, fileName).subscribe(resp => {
      this.dFile = resp;
      if (resp.state === 'DONE') {
        this.dlInProgress = false;
        this.dlComplete = true;
        if (this.productDownloaded) {
          this.productDownloaded.emit(product);
        }
      }
    });
  }
}
