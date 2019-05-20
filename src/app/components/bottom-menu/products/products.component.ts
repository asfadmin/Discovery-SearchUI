import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import * as models from '@models';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  @Input() products: models.CMRProduct[];
  @Input() queuedProductIds: string[];

  @Output() toggleQueueProduct = new EventEmitter<models.CMRProduct>();

  public onToggleQueueProduct(product: models.CMRProduct): void {
    this.toggleQueueProduct.emit(product);
  }
}
