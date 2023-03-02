import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResizableModule } from 'angular-resizable-element';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSliderModule } from '@angular/material/slider';

import { TruncateModule } from '@yellowspot/ng-truncate';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PipesModule } from '@pipes';
import { MatSharedModule } from '@shared';
import { ScenesListModule } from './scenes-list';
import { ScenesListHeaderModule } from './scenes-list-header/scenes-list-header.module';
import { SceneMetadataModule } from '@components/shared/scene-metadata';
import { OnDemandAddMenuModule } from '@components/shared/on-demand-add-menu';
import { SceneFilesModule } from './scene-files';
import { SceneDetailModule } from './scene-detail';
import { BaselineChartModule } from '@components/baseline-chart/baseline-chart.module';
import { SBASChartModule } from '@components/sbas-chart/sbas-chart.module';

import { SbasResultsMenuModule } from './sbas-results-menu/sbas-results-menu.module';
import { SarviewsResultsMenuModule } from './sarviews-results-menu/sarviews-results-menu.module';
import { BaselineResultsMenuModule } from './baseline-results-menu/baseline-results-menu.module';
import { DesktopResultsMenuModule } from './desktop-results-menu/desktop-results-menu.module';

import { ResultsMenuComponent } from './results-menu.component';
import { MobileResultsMenuComponent } from './mobile-results-menu/mobile-results-menu.component';

@NgModule({
  declarations: [
    ResultsMenuComponent,
    MobileResultsMenuComponent,
  ],
  imports: [
    CommonModule,
    ResizableModule,
    FlexLayoutModule,
    TruncateModule,
    MatMenuModule,
    MatSharedModule,
    MatTabsModule,
    PipesModule,
    ScenesListModule,
    SceneFilesModule,
    SceneDetailModule,

    ScenesListHeaderModule,
    BaselineChartModule,
    OnDemandAddMenuModule,
    SBASChartModule,
    MatSliderModule,
    FormsModule,
    SceneMetadataModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FontAwesomeModule,

    SbasResultsMenuModule,
    SarviewsResultsMenuModule,
    BaselineResultsMenuModule,
    DesktopResultsMenuModule,
  ],
  exports: [
    ResultsMenuComponent,
  ],
})
export class ResultsMenuModule { }
