import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import * as models from '@models';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  @Input() product: models.CMRProduct;
  @Input() isQueued: boolean;

  @Output() toggle = new EventEmitter<void>();

  public isHovered = false;

  constructor() {}

  ngOnInit() {}

  public onToggleQueueProduct(): void {
    this.toggle.emit();
  }
}
