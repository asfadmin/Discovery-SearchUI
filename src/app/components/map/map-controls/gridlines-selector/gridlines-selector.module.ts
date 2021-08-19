import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatSharedModule } from '@shared';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { GridlinesSelectorComponent } from './gridlines-selector.component';


@NgModule({
  declarations: [
    GridlinesSelectorComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatCheckboxModule,
    MatSharedModule,
    MatButtonToggleModule
  ],
  exports: [
    GridlinesSelectorComponent
  ]
})
export class GridlinesSelectorModule { }
