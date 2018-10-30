import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapComponent } from './map.component';
import { ProjectionSelectionComponent } from './projection-selection';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    MapComponent,
    ProjectionSelectionComponent,
  ],
  exports: [
    MapComponent
  ]
})
export class MapModule { }
