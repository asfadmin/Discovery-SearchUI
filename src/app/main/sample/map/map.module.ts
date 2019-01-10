import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapComponent } from './map.component';
import { ViewSelectorComponent } from './view-selector';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    MapComponent,
    ViewSelectorComponent,
  ],
  exports: [
    MapComponent
  ]
})
export class MapModule { }
