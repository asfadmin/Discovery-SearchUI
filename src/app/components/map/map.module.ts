import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatBadgeModule } from '@angular/material';
import { MatSharedModule } from '@shared';

import { MapComponent } from './map.component';
import { ViewSelectorComponent } from './view-selector';
import { InteractionSelectorComponent } from './interaction-selector';
import { DrawSelectorComponent } from './draw-selector/draw-selector.component';
import { FileUploadModule } from './file-upload';
import { AttributionsComponent } from './attributions/attributions.component';

@NgModule({
  imports: [
    CommonModule,

    MatButtonToggleModule,
    MatBadgeModule,
    MatSharedModule,

    FileUploadModule,
  ],
  declarations: [
    MapComponent,
    ViewSelectorComponent,
    DrawSelectorComponent,
    InteractionSelectorComponent,
    AttributionsComponent
  ],
  exports: [
    MapComponent
  ]
})
export class MapModule { }
