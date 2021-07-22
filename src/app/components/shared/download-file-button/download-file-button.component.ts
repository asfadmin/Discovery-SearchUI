import { Component, Input, OnInit } from '@angular/core';
import { Download } from 'ngx-operators';
import { DownloadService } from '@services/download.service';
import { Observable } from 'rxjs';
import { CMRProduct } from '@models';

@Component({
  selector: 'app-download-file-button',
  templateUrl: './download-file-button.component.html',
  styleUrls: ['./download-file-button.component.scss']
})
export class DownloadFileButtonComponent implements OnInit {
  @Input() product: CMRProduct;

  download$: Observable<Download>;
  public dFile: Download;
  public dlInProgress = false;
  public dlComplete = false;

  constructor(
    private downloadService: DownloadService,
  ) { }

  ngOnInit(): void {
  }

  public downloadFile(url: string, filename: string) {
    if (this.dlInProgress) { return; }
    this.dlInProgress = true;
    this.downloadService.download(url, filename).subscribe( resp => {
      this.dFile = resp;
      if (resp.state === 'DONE') {
        this.dlInProgress = false;
        this.dlComplete = true;
      }
      // console.log ('download in progress:', this.dlInProgress, 'resp:', resp);
    });
  }
}
