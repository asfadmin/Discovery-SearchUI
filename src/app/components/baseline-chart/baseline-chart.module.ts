import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaselineChartComponent } from './baseline-chart.component';



@NgModule({
  declarations: [BaselineChartComponent],
  imports: [
    CommonModule
  ],
  exports: [
    BaselineChartComponent,
  ]
})
export class BaselineChartModule { }
