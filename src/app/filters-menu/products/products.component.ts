import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

import { faFileDownload } from '@fortawesome/free-solid-svg-icons';

import { SentinelGranule } from '../../models';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProductsComponent {
  @Input() products: SentinelGranule[];

  public downloadIcon = faFileDownload;
}
