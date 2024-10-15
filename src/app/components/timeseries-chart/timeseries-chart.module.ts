import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSharedModule } from '@shared';

import { TranslateModule } from "@ngx-translate/core";
import { TimeseriesChartComponent } from './timeseries-chart.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ResizedEventModule } from '@directives/resized.directive';
import { TimeseriesChartConfigComponent } from './timeseries-chart-config'
import { ChartModalComponent } from '@components/shared/chart-modal/chart-modal.component'
import {TimeseriesChartZoomComponent} from '@components/timeseries-chart/timeseries-chart-zoom/timeseries-chart-zoom.component';
import {MatCheckbox} from '@angular/material/checkbox';
@NgModule({
  declarations: [TimeseriesChartComponent],
  imports: [
    CommonModule,
    MatSharedModule,
    TranslateModule,
    MatTableModule,
    MatIconModule,
    ResizedEventModule,
    MatSharedModule,
    ChartModalComponent,
    TimeseriesChartConfigComponent,
    TimeseriesChartZoomComponent,
    MatCheckbox
  ],
  exports: [
    TimeseriesChartComponent,
  ]
})
export class TimeseriesChartModule { }
