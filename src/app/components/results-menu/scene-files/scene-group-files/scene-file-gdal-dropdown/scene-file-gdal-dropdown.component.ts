import { Component, inject, input, computed } from '@angular/core';
import { GdalService } from '@services/gdal/gdal.service';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SceneFileGdalDropdownDatasetComponent } from './scene-file-gdal-dropdown-dataset/scene-file-gdal-dropdown-dataset.component';

import * as models from '@models';
import { DocsModalComponent } from '@components/shared/docs-modal/docs-modal.component';

@Component({
  selector: 'app-scene-file-gdal-dropdown',
  imports: [
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    CdkAccordionModule,
    TranslateModule,
    SceneFileGdalDropdownDatasetComponent, // I apologize for this name
    DocsModalComponent,
  ],
  templateUrl: './scene-file-gdal-dropdown.component.html',
  styleUrl: './scene-file-gdal-dropdown.component.scss',
})
export class SceneFileGdalDropdownComponent {
  private gdalService = inject(GdalService);
  product = input.required<models.CMRProduct>();
  datasets = computed(() =>
    this.gdalService.getProductDatasets(
      this.gdalService.cmrProductToGDALProductInfo(this.product()),
    ),
  );
}
