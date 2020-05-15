import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSharedModule } from '@shared';

import { SBASChartComponent } from './sbas-chart.component';



@NgModule({
  declarations: [SBASChartComponent],
  imports: [
    CommonModule,
    MatSharedModule
  ],
  exports: [
    SBASChartComponent,
  ]
})
export class SBASChartModule { }
