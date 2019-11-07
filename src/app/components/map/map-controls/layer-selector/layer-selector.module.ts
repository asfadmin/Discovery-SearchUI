import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSharedModule } from '@shared';

import { LayerSelectorComponent } from './layer-selector.component';



@NgModule({
  declarations: [
    LayerSelectorComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonToggleModule,
    MatSharedModule
  ],
  exports: [
    LayerSelectorComponent
  ]
})
export class LayerSelectorModule { }
