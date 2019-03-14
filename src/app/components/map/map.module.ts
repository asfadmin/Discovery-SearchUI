import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatBadgeModule, MatDialogModule } from '@angular/material';

import { MatSharedModule } from '@shared';

import { MapComponent } from './map.component';
import { MapControlsModule } from './map-controls';
import { NavBarModule } from './nav-bar';
import { FileUploadModule } from './file-upload';
import { AttributionsComponent } from './attributions/attributions.component';
import { QueueModule, QueueComponent } from './queue';

@NgModule({
  imports: [
    CommonModule,

    MatDialogModule,

    MatSharedModule,

    MapControlsModule,
    NavBarModule,
    QueueModule,
    FileUploadModule,
  ],
  declarations: [
    MapComponent,
    AttributionsComponent
  ],
  entryComponents: [
    QueueComponent
  ],
  exports: [
    MapComponent
  ]
})
export class MapModule { }
