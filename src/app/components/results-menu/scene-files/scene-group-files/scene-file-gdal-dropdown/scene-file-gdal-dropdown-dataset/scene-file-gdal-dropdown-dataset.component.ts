import { Component, input, inject, computed } from '@angular/core';
import { CopyToClipboardComponent } from '@components/shared/copy-to-clipboard/copy-to-clipboard.component';
import { TranslateModule } from '@ngx-translate/core';
import { GdalService } from '@services/gdal/gdal.service';

import * as models from '@models';

@Component({
  selector: 'app-scene-file-gdal-dropdown-dataset',
  imports: [CopyToClipboardComponent, TranslateModule],
  templateUrl: './scene-file-gdal-dropdown-dataset.component.html',
  styleUrl: './scene-file-gdal-dropdown-dataset.component.scss',
})
export class SceneFileGdalDropdownDatasetComponent {
  private gdalService = inject(GdalService);

  dataset = input<models.GDALDataset>();
  product = input<models.CMRProduct>();
  gdalProduct = computed(() =>
    this.gdalService.cmrProductToGDALProductInfo(this.product()),
  );
  gdalOptions = computed(() => {
    return {
      product: this.gdalProduct(),
      datasetPath: this.dataset().path,
    };
  });
  gdalCommand = computed(() =>
    this.gdalService.generateGDALCommand(this.gdalOptions()),
  );
  qgisScript = computed(() =>
    this.gdalService.generateQGISScript(this.gdalOptions()),
  );

  downloadURL = computed(
    () => `/vsicurl/"${this.product().downloadUrl}":${this.dataset().path}`,
  );
}
