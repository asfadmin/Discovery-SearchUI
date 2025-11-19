import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { ViewSelectorComponent } from './view-selector.component';
import { SharedModule } from '@shared';

@NgModule({
  imports: [
    CommonModule,
    MatButtonToggleModule,
    MatMenuModule,
    SharedModule,
    ViewSelectorComponent,
  ],
  exports: [ViewSelectorComponent],
})
export class ViewSelectorModule {}
