import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSharedModule } from '@shared';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MapComponent } from './map.component';
import { MapControlsModule } from './map-controls';
import { FileUploadModule } from './file-upload';
import { AttributionsComponent } from './attributions/attributions.component';
import { AdditionalFiltersModule } from '@components/additional-filters';


@NgModule({
  imports: [
    CommonModule,

    MatDialogModule,
    MatSharedModule,
    FlexLayoutModule,

    MapControlsModule,
    FileUploadModule,
    AdditionalFiltersModule,
  ],
  declarations: [
    MapComponent,
    AttributionsComponent
  ],
  exports: [ MapComponent ]
})
export class MapModule { }
