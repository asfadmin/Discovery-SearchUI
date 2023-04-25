import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSharedModule } from '@shared';

import { ViewSelectorComponent } from './view-selector.component';


@NgModule({
  declarations: [
    ViewSelectorComponent,
  ],
  imports: [
    CommonModule,
    MatButtonToggleModule,
    MatSharedModule,
    MatMenuModule,
  ],
  exports: [
    ViewSelectorComponent
  ]
})
export class ViewSelectorModule { }
