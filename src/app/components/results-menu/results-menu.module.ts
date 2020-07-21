import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { ResizableModule } from 'angular-resizable-element';

import { TruncateModule } from '@yellowspot/ng-truncate';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatMenuModule } from '@angular/material/menu';

import { PipesModule } from '@pipes';
import { MatSharedModule } from '@shared';
import { ScenesListModule } from './scenes-list';
import { ResultsMenuComponent } from './results-menu.component';
import { SceneMetadataModule } from '@components/shared/scene-metadata';
import { SceneFilesModule } from './scene-files';
import { SceneDetailModule } from './scene-detail';
import { ScenesListHeaderComponent } from './scenes-list-header/scenes-list-header.component';
import { MobileResultsMenuComponent } from './mobile-results-menu/mobile-results-menu.component';
import { DesktopResultsMenuComponent } from './desktop-results-menu/desktop-results-menu.component';
import { BaselineResultsMenuComponent } from './baseline-results-menu/baseline-results-menu.component';
import { BaselineChartModule } from '@components/baseline-chart/baseline-chart.module';
import { SBASResultsMenuComponent } from './sbas-results-menu/sbas-results-menu.component';
import { SBASChartModule } from '@components/sbas-chart/sbas-chart.module';
import { SbasSlidersComponent } from './sbas-sliders/sbas-sliders.component';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { SbasSlidersTwoComponent } from './sbas-sliders-two/sbas-sliders-two.component';

@NgModule({
  declarations: [
    ResultsMenuComponent,
    ScenesListHeaderComponent,
    MobileResultsMenuComponent,
    DesktopResultsMenuComponent,
    BaselineResultsMenuComponent,
    SBASResultsMenuComponent,
    SbasSlidersComponent,
    SbasSlidersTwoComponent
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
    BaselineChartModule,
    SBASChartModule,
    MatSliderModule,
    FormsModule,
    SceneMetadataModule,
  ],
  exports: [ResultsMenuComponent],
})
export class ResultsMenuModule { }
