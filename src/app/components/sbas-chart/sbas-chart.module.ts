import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSharedModule } from '@shared';

import { AngularResizedEventModule } from 'angular-resize-event';

import { SBASChartComponent } from './sbas-chart.component';



@NgModule({
  declarations: [SBASChartComponent],
  imports: [
    CommonModule,
    MatSharedModule,
    AngularResizedEventModule
  ],
  exports: [
    SBASChartComponent,
  ]
})
export class SBASChartModule { }
