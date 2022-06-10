import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSharedModule } from '@shared';

import { BaselineChartComponent } from './baseline-chart.component';
import { AngularResizeEventModule } from 'angular-resize-event';



@NgModule({
  declarations: [BaselineChartComponent],
  imports: [
    CommonModule,
    MatSharedModule,
    AngularResizeEventModule
  ],
  exports: [
    BaselineChartComponent,
  ]
})
export class BaselineChartModule { }
