import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonToggleModule } from '@angular/material';
import { MatSharedModule } from '@shared';

import { RibbonComponent } from './ribbon.component';

@NgModule({
  declarations: [
    RibbonComponent,
  ],
  imports: [
    CommonModule,
    MatSharedModule,
    MatButtonToggleModule,
  ],
  exports: [
    RibbonComponent
  ]
})
export class RibbonModule { }
