import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import * as models from '@models';

@Component({
  selector: 'app-scene-files',
  templateUrl: './scene-files.component.html',
  styleUrls: ['./scene-files.component.scss']
})
export class SceneFilesComponent {
  @Input() products: models.CMRProduct[];
  @Input() queuedProductIds: string[];

  @Output() toggleQueueProduct = new EventEmitter<models.CMRProduct>();

  public onToggleQueueProduct(product: models.CMRProduct): void {
    this.toggleQueueProduct.emit(product);
  }
}
