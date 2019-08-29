import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { MatSharedModule } from '@shared';

import { AoiOptionsComponent } from './aoi-options.component';
import { DrawSelectorComponent } from './draw-selector/draw-selector.component';
import { InteractionSelectorComponent } from './interaction-selector';


@NgModule({
  declarations: [
    AoiOptionsComponent,
    DrawSelectorComponent,
    InteractionSelectorComponent
  ],
  imports: [
    CommonModule,
    MatButtonToggleModule,
    MatInputModule,
    MatMenuModule,
    MatSharedModule,
  ],
  exports: [
    AoiOptionsComponent,
    DrawSelectorComponent,
    InteractionSelectorComponent
  ]
})
export class AoiOptionsModule { }
