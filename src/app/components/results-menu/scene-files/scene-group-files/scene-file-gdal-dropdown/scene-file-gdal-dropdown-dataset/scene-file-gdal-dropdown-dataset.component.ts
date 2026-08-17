import { Component, input, inject, computed } from '@angular/core';
import { CopyToClipboardComponent } from '@components/shared/copy-to-clipboard/copy-to-clipboard.component';
import { TranslateModule } from '@ngx-translate/core';
import { GdalCustomizeMenuComponent } from '@components/shared/gdal-customize-menu/gdal-customize-menu.component';
import { GdalService } from '@services/gdal/gdal.service';

import * as models from '@models';

@Component({
  selector: 'app-scene-file-gdal-dropdown-dataset',
  imports: [
    CopyToClipboardComponent,
    TranslateModule,
    GdalCustomizeMenuComponent,
  ],
  templateUrl: './scene-file-gdal-dropdown-dataset.component.html',
  styleUrl: './scene-file-gdal-dropdown-dataset.component.scss',
})
export class SceneFileGdalDropdownDatasetComponent {
  private gdalService = inject(GdalService);

  dataset = input<models.NISARDataset>();
  product = input<models.CMRProduct>();
  gdalCommand = computed(() =>
    this.gdalService.generateGDALCommand(this.product(), this.dataset().path),
  );
}
