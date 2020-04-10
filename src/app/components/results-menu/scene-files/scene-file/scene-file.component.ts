import { Component, Input, Output, EventEmitter } from '@angular/core';

import * as models from '@models';

@Component({
  selector: 'app-scene-file',
  templateUrl: './scene-file.component.html',
  styleUrls: ['./scene-file.component.scss']
})
export class SceneFileComponent {
  @Input() product: models.CMRProduct;
  @Input() isQueued: boolean;
  @Input() isUnzipLoading: boolean;
  @Input() isOpen: boolean;
  @Input() isUserLoggedIn: boolean;
  @Input() hasAccessToRestrictedData: boolean;

  @Output() toggle = new EventEmitter<void>();
  @Output() unzip = new EventEmitter<models.CMRProduct>();
  @Output() closeProduct = new EventEmitter<models.CMRProduct>();

  public isHovered = false;

  constructor() {}

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

  public isUnzipDisabled(isLoggedIn: boolean, hasAccess: boolean): boolean {
    return (
      !isLoggedIn ||
      (this.isRestrictedDataset() && !hasAccess)
    );
  }

  private isRestrictedDataset(): boolean {
    return (
      this.product.dataset.includes('RADARSAT-1') ||
      this.product.dataset.includes('JERS-1')
    );
  }

  public unzipTooltip(isLoggedIn: boolean, hasAccess: boolean): string {
    if (!isLoggedIn) {
      return 'Login to view contents';
    }

    if (this.isRestrictedDataset() && !hasAccess) {
      return 'Cannot view restricted dataset';
    }

    return 'View file contents';
  }

  public canUnzip(product: models.CMRProduct): boolean {
    const dataset = product.dataset.toLowerCase();

    return (
      (
        !dataset.includes('sentinel') ||
        dataset === 'sentinel-1 interferogram (beta)'
      ) &&
      product.downloadUrl.endsWith('.zip')
    );
  }
}
