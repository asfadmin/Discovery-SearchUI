import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { GridlinesSelectorComponent } from './gridlines-selector.component';
import { SharedModule } from '@shared';

@NgModule({
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    SharedModule,
    GridlinesSelectorComponent,
  ],
  exports: [GridlinesSelectorComponent],
})
export class GridlinesSelectorModule {}
