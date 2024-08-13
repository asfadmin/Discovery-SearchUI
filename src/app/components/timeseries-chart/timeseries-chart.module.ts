import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSharedModule } from '@shared';

import { TranslateModule } from "@ngx-translate/core";
import { TimeseriesChartComponent } from './timeseries-chart.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import {ResizedEventModule} from '@directives/resized.directive';


@NgModule({
  declarations: [TimeseriesChartComponent],
    imports: [
        CommonModule,
        MatSharedModule,
        TranslateModule,
        MatTableModule,
        MatIconModule,
        ResizedEventModule
    ],
  exports: [
    TimeseriesChartComponent,
  ]
})
export class TimeseriesChartModule { }