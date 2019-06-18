import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import * as models from '@models';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {
  @Input() product: models.CMRProduct;
  @Input() isQueued: boolean;

  @Output() toggle = new EventEmitter<void>();

  public isHovered = false;

  public onToggleQueueProduct(): void {
    this.toggle.emit();
  }
}
