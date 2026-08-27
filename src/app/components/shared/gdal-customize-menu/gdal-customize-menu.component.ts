import { Component, input, inject, computed } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { GdalCustomizeDialogComponent } from './gdal-customize-dialog/gdal-customize-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

import * as models from '@models';
import { GdalProductInfo, GdalService } from '@services/gdal/gdal.service';

export interface GdalCustomizeDialogData {
  product: GdalProductInfo;
  datasets: models.GDALDataset[];
}

@Component({
  selector: 'app-gdal-customize-menu',
  imports: [MatIcon, MatIconButton, MatTooltipModule, TranslateModule],
  templateUrl: './gdal-customize-menu.component.html',
  styleUrl: './gdal-customize-menu.component.scss',
})
export class GdalCustomizeMenuComponent {
  gdalService = inject(GdalService);

  gdalProduct = input<GdalProductInfo>();
  datasets = computed(() =>
    this.gdalService.getProductDatasets(this.gdalProduct()),
  );

  readonly dialog = inject(MatDialog);

  openDialog(): void {
    this.dialog.open(GdalCustomizeDialogComponent, {
      data: {
        product: this.gdalProduct(),
        datasets: this.datasets(),
      },
      maxWidth: '80em',
      maxHeight: '95vh',
      height: '100%',
      width: '100%',
    });
  }
}
