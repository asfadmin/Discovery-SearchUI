import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSharedModule } from '@shared';

import { ResizedEventModule } from '@directives/resized.directive';

import { SBASChartComponent } from './sbas-chart.component';



@NgModule({
  declarations: [SBASChartComponent],
  imports: [
    CommonModule,
    MatSharedModule,
    ResizedEventModule
  ],
  exports: [
    SBASChartComponent,
  ]
})
export class SBASChartModule { }
