import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSharedModule } from '@shared';

import { TranslateModule } from "@ngx-translate/core";
import { TimeseriesChartComponent } from './timeseries-chart.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';


@NgModule({
  declarations: [TimeseriesChartComponent],
  imports: [
    CommonModule,
    MatSharedModule,
    TranslateModule,
	MatTableModule,
	MatIconModule
  ],
  exports: [
    TimeseriesChartComponent,
  ]
})
export class TimeseriesChartModule { }
