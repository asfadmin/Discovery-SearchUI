import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {BaselineHeaderComponent} from "./baseline-header.component";

@NgModule({
  declarations: [
    BaselineHeaderComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    BaselineHeaderComponent
  ]
})
export class BaselineHeaderModule { }
