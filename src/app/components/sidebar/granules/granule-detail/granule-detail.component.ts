import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { faDownload, faPlus } from '@fortawesome/free-solid-svg-icons';

import { Sentinel1Product } from '@models';

@Component({
  selector: 'app-granule-detail',
  templateUrl: './granule-detail.component.html',
  styleUrls: ['./granule-detail.component.scss']
})
export class GranuleDetailComponent {
  public downloadIcon = faDownload;
  public selectIcon = faPlus;

  @Input() granule: Sentinel1Product;
  @Input() products: Sentinel1Product[];

  @Output() newQueueItem = new EventEmitter<Sentinel1Product>();
  @Output() newQueueItems = new EventEmitter<Sentinel1Product[]>();
  @Output() newFocusedGranule = new EventEmitter<Sentinel1Product>();
  @Output() clearFocusedGranule = new EventEmitter<void>();

  public onNewQueueProduct(product: Sentinel1Product): void {
    this.newQueueItem.emit(product);
  }

  public onQueueAllProducts(): void {
    this.newQueueItems.emit(this.products);
  }

  public onSetFocusedGranule(granule: Sentinel1Product): void {
    this.newFocusedGranule.emit(granule);
  }

  public onClearFocusedGranule(): void {
    this.clearFocusedGranule.emit();
  }
}
