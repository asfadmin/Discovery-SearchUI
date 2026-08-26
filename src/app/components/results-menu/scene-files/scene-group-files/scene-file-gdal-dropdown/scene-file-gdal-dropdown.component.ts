import {
  Component,
  inject,
  input,
  computed,
  EnvironmentInjector,
  createComponent,
} from '@angular/core';
import { GdalProductInfo, GdalService } from '@services/gdal/gdal.service';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SceneFileGdalDropdownDatasetComponent } from './scene-file-gdal-dropdown-dataset/scene-file-gdal-dropdown-dataset.component';

import { DocsModalComponent } from '@components/shared/docs-modal/docs-modal.component';
import { GdalCustomizeMenuComponent } from '@components/shared/gdal-customize-menu/gdal-customize-menu.component';

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
  gdalProduct = input.required<GdalProductInfo>();
  gdalDatasets = computed(() =>
    this.gdalService.getProductDatasets(this.gdalProduct()),
  );
  private injector = inject(EnvironmentInjector);

  openGdalDialog() {
    const componentRef = createComponent(GdalCustomizeMenuComponent, {
      environmentInjector: this.injector,
    });

    componentRef.setInput('gdalProduct', this.gdalProduct());
    componentRef.instance.openDialog();
  }
}
