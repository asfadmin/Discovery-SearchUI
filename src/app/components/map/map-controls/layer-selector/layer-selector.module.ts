import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSharedModule } from '@shared';
import { MatMenuModule } from '@angular/material/menu';

import { LayerSelectorComponent } from './layer-selector.component';
import { GridlinesSelectorModule } from '@components/map/map-controls/gridlines-selector';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SharedModule } from "@shared";

@NgModule({
  declarations: [
    LayerSelectorComponent
  ],
  imports: [
    CommonModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatSharedModule,
    MatCheckboxModule,
    GridlinesSelectorModule,
    SharedModule
  ],
  exports: [
    LayerSelectorComponent
  ]
})
export class LayerSelectorModule { }
