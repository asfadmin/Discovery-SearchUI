import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapComponent } from './map.component';
import { ViewSelectorComponent } from './projection-selection';
import { MapService } from '../services';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    MapComponent,
    ViewSelectorComponent,
  ],
  providers: [
    MapService
  ],
  exports: [
    MapComponent
  ]
})
export class MapModule { }
