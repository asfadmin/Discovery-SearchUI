import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatSharedModule } from '@shared';

import { MapControlsComponent } from './map-controls.component';
import { ViewSelectorComponent } from './view-selector';
import { AoiOptionsModule } from '@components/shared/aoi-options';

@NgModule({
  imports: [
    CommonModule,
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
