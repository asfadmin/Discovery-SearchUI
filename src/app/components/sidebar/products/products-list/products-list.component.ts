import {
  Component, OnInit, Input,
  ViewEncapsulation, Output, EventEmitter
} from '@angular/core';

import { faFileDownload } from '@fortawesome/free-solid-svg-icons';

import { Sentinel1Product } from '@models';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductsListComponent  {
  @Input() products: Sentinel1Product[];
  @Input() selected: Sentinel1Product;

  @Output() newSelected = new EventEmitter<string>();

  public downloadIcon = faFileDownload;

  public onProductSelected(name: string): void {
    this.newSelected.emit(name);
  }
}
