import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSharedModule } from '@shared';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ResizableModule } from 'angular-resizable-element';

import { SceneDetailModule } from '../scene-detail';
import { ScenesListModule } from '../scenes-list';
import { ScenesListHeaderModule } from '../scenes-list-header/scenes-list-header.module';
import { OnDemandAddMenuModule } from '@components/shared/on-demand-add-menu';

import { BaselineChartModule } from '@components/baseline-chart/baseline-chart.module';

import { BaselineResultsMenuComponent } from './baseline-results-menu.component';
import  { SharedModule } from "@shared";


@NgModule({
  declarations: [
    BaselineResultsMenuComponent
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    MatSharedModule,
    MatButtonToggleModule,
    FlexLayoutModule,
    ResizableModule,
    SharedModule,
    SceneDetailModule,
    ScenesListModule,
    ScenesListHeaderModule,
    OnDemandAddMenuModule,
    BaselineChartModule,
  ],
  exports: [
    BaselineResultsMenuComponent
  ]
})
export class BaselineResultsMenuModule { }
