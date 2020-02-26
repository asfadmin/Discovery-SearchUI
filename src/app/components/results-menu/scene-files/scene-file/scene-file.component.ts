import { Component, Input, Output, EventEmitter } from '@angular/core';

import { UnzipApiService } from '@services';
import * as models from '@models';

@Component({
  selector: 'app-scene-file',
  templateUrl: './scene-file.component.html',
  styleUrls: ['./scene-file.component.css']
})
export class SceneFileComponent {
  @Input() product: models.CMRProduct;
  @Input() isQueued: boolean;
  @Input() isUnzipLoading: boolean;
  @Input() isOpen: boolean;
  @Input() isUserLoggedIn: boolean;

  @Output() toggle = new EventEmitter<void>();
  @Output() unzip = new EventEmitter<models.CMRProduct>();
  @Output() closeProduct = new EventEmitter<models.CMRProduct>();

  public isHovered = false;

  constructor(private unzipService: UnzipApiService) {}

  public onToggleQueueProduct(): void {
    this.toggle.emit();
  }

  public onLoadUnzippedPoduct(): void {
    if (!this.isUserLoggedIn) {
      return;
    }

    this.unzip.emit(this.product);
  }

  public onCloseProduct(): void {
    this.closeProduct.emit(this.product);
  }

  public canUnzip(product: models.CMRProduct): boolean {
    const dataset = product.dataset.toLowerCase();

    return (
      !dataset.includes('sentinel') &&
      !dataset.includes('sir-c') &&
      product.downloadUrl.endsWith('.zip')
    );
  }
}
