import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {BaselineHeaderComponent} from "./baseline-header.component";
import { SharedModule } from "../../../shared";

@NgModule({
  declarations: [
    BaselineHeaderComponent,
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    BaselineHeaderComponent
  ]
})
export class BaselineHeaderModule { }
