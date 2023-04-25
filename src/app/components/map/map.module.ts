import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSharedModule } from '@shared';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SearchButtonModule } from '@components/shared/search-button';
import { ClearButtonModule } from '@components/shared/clear-button';
import { MaxResultsSelectorModule } from '@components/shared/max-results-selector';
import { ViewSelectorModule } from './map-controls/view-selector';
import { LayerSelectorModule } from './map-controls/layer-selector';
import { GridlinesSelectorModule } from './map-controls/gridlines-selector';

import { MapComponent } from './map.component';
import { MapControlsModule } from './map-controls';
import { AoiOptionsModule } from '@components/shared/aoi-options';
import { AttributionsComponent } from './attributions/attributions.component';
import { FiltersDropdownModule } from '@components/filters-dropdown';
import { BannersModule } from './banners';

import { FileUploadModule } from '@components/shared/aoi-options/file-upload';
import { SharedModule } from "@shared";

@NgModule({
  imports: [
    CommonModule,

    MatDialogModule,
    MatSharedModule,
    FlexLayoutModule,

    ViewSelectorModule,
    LayerSelectorModule,
    GridlinesSelectorModule,
    MapControlsModule,
    FiltersDropdownModule,
    AoiOptionsModule,

    SearchButtonModule,
    ClearButtonModule,
    MaxResultsSelectorModule,
    BannersModule,
    FileUploadModule,
    SharedModule
  ],
  declarations: [
    MapComponent,
    AttributionsComponent,
  ],
  exports: [ MapComponent ]
})
export class MapModule { }
