import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSharedModule } from '@shared';

import { SbasResultsMenuModule } from '../sbas-results-menu/sbas-results-menu.module';
import { SBASChartModule } from '@components/sbas-chart/sbas-chart.module';
import { BaselineChartModule } from '@components/baseline-chart/baseline-chart.module';
import { SceneMetadataModule } from '@components/shared/scene-metadata';
import { SceneFilesModule } from '../scene-files';
import { SceneDetailModule } from '../scene-detail';
import { ScenesListModule } from '../scenes-list';
import { ScenesListHeaderModule } from '../scenes-list-header';

import { MobileResultsMenuComponent } from './mobile-results-menu.component';
import { SharedModule } from "@shared";


@NgModule({
  declarations: [
    MobileResultsMenuComponent
  ],
  imports: [
    CommonModule,
    MatSharedModule,
    MatButtonToggleModule,

    SharedModule,
    SBASChartModule,
    BaselineChartModule,
    SbasResultsMenuModule,
    SceneFilesModule,
    SceneMetadataModule,
    SceneDetailModule,
    ScenesListModule,
    ScenesListHeaderModule,
  ],
  exports: [
    MobileResultsMenuComponent
  ]
})
export class MobileResultsMenuModule { }
