import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import * as models from '@models';


@Component({
  selector: 'app-product-type-selector',
  templateUrl: './product-type-selector.component.html',
  styleUrls: ['./product-type-selector.component.css']
})
export class ProductTypeSelectorComponent implements OnInit {
  @Input() dataset: models.Dataset;
  @Input() types: models.ProductType[];
  @Output() typesChange = new EventEmitter<models.ProductType[]>();

  constructor() { }

  ngOnInit(): void {
  }

  public onNewProductTypes(productTypes: models.ProductType[]): void {
    this.typesChange.emit(productTypes);
  }
}
