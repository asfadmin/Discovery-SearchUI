import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { TimeseriesResultsMenuComponent } from './timeseries-results-menu.component';
import { SharedModule } from '@shared';
import { MatIconModule } from '@angular/material/icon';
import { ScenesListModule } from '../scenes-list';
import { ScenesListHeaderModule } from '../scenes-list-header';
import { SceneMetadataModule } from '@components/shared/scene-metadata';

import { ResizableModule } from 'angular-resizable-element';
import { MatRadioModule } from '@angular/material/radio';

import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { TimeseriesChartTemporalSliderComponent } from '@components/timeseries-chart/timeseries-chart-temporal-slider/timeseries-chart-temporal-slider.component';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelTitle,
  MatExpansionPanelHeader,
} from '@angular/material/expansion';

@NgModule({
  imports: [
    CommonModule,
    MatMenuModule,
    MatIconModule,
    MatButtonToggleModule,
    FontAwesomeModule,
    SharedModule,
    ScenesListModule,
    ScenesListHeaderModule,
    SceneMetadataModule,
    ResizableModule,
    MatRadioModule,
    MatTabGroup,
    MatTab,
    TimeseriesChartTemporalSliderComponent,
    MatCheckbox,
    MatProgressSpinnerModule,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
    TimeseriesResultsMenuComponent,
  ],
  exports: [TimeseriesResultsMenuComponent],
})
export class TimeseriesResultsMenuModule {}
