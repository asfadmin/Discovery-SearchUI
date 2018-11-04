import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapComponent } from './map.component';
import { ProjectionSelectionComponent } from './projection-selection';
import { MapService } from '../services';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    MapComponent,
    ProjectionSelectionComponent,
  ],
  providers: [
    MapService
  ],
  exports: [
    MapComponent
  ]
})
export class MapModule { }
