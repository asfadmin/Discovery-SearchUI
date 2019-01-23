import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { MapComponent } from './map.component';
import { ViewSelectorComponent } from './view-selector';

@NgModule({
  imports: [
    CommonModule,

    MatButtonToggleModule
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
