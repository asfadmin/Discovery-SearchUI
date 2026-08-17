import { Component, input, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { GdalCustomizeDialogComponent } from './gdal-customize-dialog/gdal-customize-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import * as models from '@models';

export interface GdalCustomizeDialogData {
  product: models.CMRProduct;
  dataset: models.NISARDataset;
}

@Component({
  selector: 'app-gdal-customize-menu',
  imports: [MatIcon, MatIconButton],
  templateUrl: './gdal-customize-menu.component.html',
  styleUrl: './gdal-customize-menu.component.scss',
})
export class GdalCustomizeMenuComponent {
  dataset = input<models.NISARDataset>();
  product = input<models.CMRProduct>();
  readonly dialog = inject(MatDialog);

  openDialog(): void {
    this.dialog.open(GdalCustomizeDialogComponent, {
      data: { product: this.product(), dataset: this.dataset() },
      minWidth: '80em',
    });
  }
}
