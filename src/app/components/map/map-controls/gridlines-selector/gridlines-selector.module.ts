import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatSharedModule } from '@shared';
import { MatCheckboxModule } from '@angular/material/checkbox';

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
  ],
  exports: [
    GridlinesSelectorComponent
  ]
})
export class GridlinesSelectorModule { }
