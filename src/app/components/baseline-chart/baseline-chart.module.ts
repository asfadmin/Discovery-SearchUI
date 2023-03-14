import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSharedModule } from '@shared';

import { BaselineChartComponent } from './baseline-chart.component';
import { AngularResizeEventModule } from 'angular-resize-event';
import { TranslateModule } from "@ngx-translate/core";


@NgModule({
  declarations: [BaselineChartComponent],
  imports: [
    CommonModule,
    MatSharedModule,
    AngularResizeEventModule,
    TranslateModule,
  ],
  exports: [
    BaselineChartComponent,
  ]
})
export class BaselineChartModule { }
