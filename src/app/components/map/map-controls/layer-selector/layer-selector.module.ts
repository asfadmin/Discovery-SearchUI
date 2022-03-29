import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSharedModule } from '@shared';
import { MatMenuModule } from '@angular/material/menu';

import { LayerSelectorComponent } from './layer-selector.component';
import { GridlinesSelectorModule } from '@components/map/map-controls/gridlines-selector';
import {MatCheckboxModule} from '@angular/material/checkbox';

@NgModule({
  declarations: [
    LayerSelectorComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatSharedModule,
    MatCheckboxModule,
    GridlinesSelectorModule
  ],
  exports: [
    LayerSelectorComponent
  ]
})
export class LayerSelectorModule { }
