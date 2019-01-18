import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

import { faFileDownload } from '@fortawesome/free-solid-svg-icons';

import { Sentinel1Product } from '@models';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProductsListComponent  {
  @Input() products: Sentinel1Product[];

  public downloadIcon = faFileDownload;
}
