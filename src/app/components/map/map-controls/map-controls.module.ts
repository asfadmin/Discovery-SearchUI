import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatSharedModule } from '@shared';

import { MapControlsComponent } from './map-controls.component';
import { ViewSelectorComponent } from './view-selector';
import { AoiOptionsModule } from '@components/shared/aoi-options';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    DragDropModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatSharedModule,
    AoiOptionsModule,
  ],
  declarations: [
    MapControlsComponent,
    ViewSelectorComponent,
  ],
  exports: [
    MapControlsComponent
  ]
})
export class MapControlsModule { }
