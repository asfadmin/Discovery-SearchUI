import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSharedModule } from '@shared';

import { ViewSelectorComponent } from './view-selector.component';
import { SharedModule } from "@shared";


@NgModule({
  declarations: [
    ViewSelectorComponent,
  ],
  imports: [
    CommonModule,
    MatButtonToggleModule,
    MatSharedModule,
    MatMenuModule,
    SharedModule
  ],
  exports: [
    ViewSelectorComponent
  ]
})
export class ViewSelectorModule { }
