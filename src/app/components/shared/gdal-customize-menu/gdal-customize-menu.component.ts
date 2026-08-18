import { Component, input, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { GdalCustomizeDialogComponent } from './gdal-customize-dialog/gdal-customize-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

import * as models from '@models';

export interface GdalCustomizeDialogData {
  product: models.CMRProduct;
}

@Component({
  selector: 'app-gdal-customize-menu',
  imports: [MatIcon, MatIconButton, MatTooltipModule, TranslateModule],
  templateUrl: './gdal-customize-menu.component.html',
  styleUrl: './gdal-customize-menu.component.scss',
})
export class GdalCustomizeMenuComponent {
  product = input<models.CMRProduct>();
  readonly dialog = inject(MatDialog);

  openDialog(): void {
    this.dialog.open(GdalCustomizeDialogComponent, {
      data: { product: this.product() },
      minWidth: '80em',
    });
  }
}
