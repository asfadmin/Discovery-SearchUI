import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { MatSharedModule } from '@shared';
import { TimeseriesResultsMenuComponent } from './timeseries-results-menu.component';
import { SharedModule } from "@shared";
import { MatIconModule } from '@angular/material/icon';
import { ScenesListModule } from '../scenes-list';
import { ScenesListHeaderModule } from '../scenes-list-header';
import { SceneMetadataModule } from '@components/shared/scene-metadata';
import { TimeseriesChartModule } from '@components/timeseries-chart/timeseries-chart.module';
import { ResizableModule } from 'angular-resizable-element';


@NgModule({
  declarations: [
    TimeseriesResultsMenuComponent
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    MatIconModule,
    MatSharedModule,
    MatButtonToggleModule,
    FontAwesomeModule,
    SharedModule,
	ScenesListModule,
	ScenesListHeaderModule,
	SceneMetadataModule,
	TimeseriesChartModule,
    ResizableModule,
  ],
  exports: [
    TimeseriesResultsMenuComponent
  ]
})
export class TimeseriesResultsMenuModule { }
