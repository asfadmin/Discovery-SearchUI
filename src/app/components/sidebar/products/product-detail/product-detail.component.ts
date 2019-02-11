import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { faDownload, faPlus } from '@fortawesome/free-solid-svg-icons';

import { Sentinel1Product } from '@models';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent {
  public downloadIcon = faDownload;
  public selectIcon = faPlus;

  @Input() granule: Sentinel1Product;
  @Input() products: Sentinel1Product[];

  @Output() newQueueItem = new EventEmitter<Sentinel1Product>();
  @Output() newQueueItems = new EventEmitter<Sentinel1Product[]>();

  public onNewQueueProduct(product: Sentinel1Product): void {
    this.newQueueItem.emit(product);
  }

  public onQueueAllProducts(): void {
    this.newQueueItems.emit(this.products);
  }
}
