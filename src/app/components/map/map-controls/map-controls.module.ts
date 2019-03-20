import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSharedModule } from '@shared';

import { MapControlsComponent } from './map-controls.component';
import { ViewSelectorComponent } from './view-selector';
import { InteractionSelectorComponent } from './interaction-selector';
import { DrawSelectorComponent } from './draw-selector/draw-selector.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonToggleModule,
    MatSharedModule,
  ],
  declarations: [
    MapControlsComponent,
    ViewSelectorComponent,
    DrawSelectorComponent,
    InteractionSelectorComponent,
  ],
  exports: [
    MapControlsComponent
  ]
})
export class MapControlsModule { }
