import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { MatMenuModule } from '@angular/material/menu';

import { LayerSelectorComponent } from './layer-selector.component';
import { GridlinesSelectorModule } from '@components/map/map-controls/gridlines-selector';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SharedModule } from '@shared';
import { MatRadioModule } from '@angular/material/radio';

@NgModule({
  imports: [
    CommonModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatCheckboxModule,
    MatRadioModule,
    GridlinesSelectorModule,
    SharedModule,
    LayerSelectorComponent,
  ],
  exports: [LayerSelectorComponent],
})
export class LayerSelectorModule {}
