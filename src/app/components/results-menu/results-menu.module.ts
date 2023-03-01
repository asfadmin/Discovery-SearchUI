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
import { ResultsMenuComponent } from './results-menu.component';
import { SceneMetadataModule } from '@components/shared/scene-metadata';
import { OnDemandAddMenuModule } from '@components/shared/on-demand-add-menu';
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
import { SbasSlidersTwoComponent } from './sbas-sliders-two/sbas-sliders-two.component';
import { SarviewsResultsMenuComponent } from './sarviews-results-menu/sarviews-results-menu.component';
import { EventProductSortSelectorModule } from '@components/shared/event-product-sort-selector/event-product-sort-selector.module';

@NgModule({
  declarations: [
    ResultsMenuComponent,
    ScenesListHeaderComponent,
    MobileResultsMenuComponent,
    DesktopResultsMenuComponent,
    BaselineResultsMenuComponent,
    SarviewsResultsMenuComponent,
    SBASResultsMenuComponent,
    SbasSlidersComponent,
    SbasSlidersTwoComponent,
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
    EventProductSortSelectorModule,
  ],
  exports: [
    ResultsMenuComponent,
    SbasSlidersTwoComponent,
    SbasSlidersComponent
  ],
})
export class ResultsMenuModule { }
