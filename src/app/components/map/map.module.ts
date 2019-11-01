import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSharedModule } from '@shared';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SearchButtonModule } from '@components/shared/search-button';
import { ClearButtonModule } from '@components/shared/clear-button';
import { MaxResultsSelectorModule } from '@components/shared/max-results-selector';
import { ViewSelectorModule } from './map-controls/view-selector';
import { LayerSelectorModule } from './map-controls/layer-selector';

import { MapComponent } from './map.component';
import { MapControlsModule } from './map-controls';
import { AoiOptionsModule } from '@components/shared/aoi-options';
import { FileUploadModule } from './file-upload';
import { AttributionsComponent } from './attributions/attributions.component';
import { SearchDropdownModule } from '@components/search-dropdown';


@NgModule({
  imports: [
    CommonModule,

    MatDialogModule,
    MatSharedModule,
    FlexLayoutModule,

    ViewSelectorModule,
    LayerSelectorModule,
    MapControlsModule,
    FileUploadModule,
    SearchDropdownModule,
    AoiOptionsModule,

    SearchButtonModule,
    ClearButtonModule,
    MaxResultsSelectorModule,
  ],
  declarations: [
    MapComponent,
    AttributionsComponent,
  ],
  exports: [ MapComponent ]
})
export class MapModule { }
