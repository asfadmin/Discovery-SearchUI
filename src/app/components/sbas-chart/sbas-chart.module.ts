import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSharedModule } from '@shared';

import { AngularResizeEventModule } from 'angular-resize-event';

import { SBASChartComponent } from './sbas-chart.component';



@NgModule({
  declarations: [SBASChartComponent],
  imports: [
    CommonModule,
    MatSharedModule,
    AngularResizeEventModule
  ],
  exports: [
    SBASChartComponent,
  ]
})
export class SBASChartModule { }
