import { Component, OnInit, Input } from '@angular/core';

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
}
