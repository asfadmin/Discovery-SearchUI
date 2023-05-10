import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSharedModule } from '@shared';

import { BaselineChartComponent } from './baseline-chart.component';
import { ResizedEventModule } from '@directives/resized.directive';
import { TranslateModule } from "@ngx-translate/core";


@NgModule({
  declarations: [BaselineChartComponent],
  imports: [
    CommonModule,
    MatSharedModule,
    ResizedEventModule,
    TranslateModule,
  ],
  exports: [
    BaselineChartComponent,
  ]
})
export class BaselineChartModule { }
