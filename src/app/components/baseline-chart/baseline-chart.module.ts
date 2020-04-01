import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSharedModule } from '@shared';

import { BaselineChartComponent } from './baseline-chart.component';



@NgModule({
  declarations: [BaselineChartComponent],
  imports: [
    CommonModule,
    MatSharedModule
  ],
  exports: [
    BaselineChartComponent,
  ]
})
export class BaselineChartModule { }
