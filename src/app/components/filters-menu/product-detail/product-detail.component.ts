import { Component, OnInit, Input } from '@angular/core';

import { faDownload } from '@fortawesome/free-solid-svg-icons';

import { Sentinel1Product } from '@models';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent {
  public downloadIcon = faDownload;

  @Input() product: Sentinel1Product;
}
