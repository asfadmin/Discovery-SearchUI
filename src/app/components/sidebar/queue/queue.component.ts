import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Sentinel1Product, AsfApiOutputFormat } from '@models';


@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.css']
})
export class QueueComponent {
  @Input() products: Sentinel1Product[];

  @Output() itemRemoved = new EventEmitter<Sentinel1Product>();
  @Output() clear = new EventEmitter<void>();

  @Output() makeDownloadScript = new EventEmitter<void>();
  @Output() metadataDownload = new EventEmitter<AsfApiOutputFormat>();

  public onRemoveProduct(product: Sentinel1Product): void {
    this.itemRemoved.emit(product);
  }

  public onClearQueue(): void {
    this.clear.emit();
  }

  public onMakeDownloadScript(): void {
    this.makeDownloadScript.emit();
  }

  public onCsvDownload(): void {
    this.metadataDownload.emit(AsfApiOutputFormat.CSV);
  }

  public onKmlDownload(): void {
    this.metadataDownload.emit(AsfApiOutputFormat.KML);
  }

  public onGeojsonDownload(): void {
    this.metadataDownload.emit(AsfApiOutputFormat.GEOJSON);
  }
}
