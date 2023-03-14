import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSharedModule } from '@shared';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SceneDetailModule } from '../scene-detail';
import { ScenesListModule } from '../scenes-list';
import { SceneFilesModule } from '../scene-files';
import { ScenesListHeaderModule } from '../scenes-list-header/scenes-list-header.module';

import { EventProductSortSelectorModule } from '@components/shared/event-product-sort-selector/event-product-sort-selector.module';

import { SarviewsResultsMenuComponent } from './sarviews-results-menu.component';
import { SharedModule } from "@shared";


@NgModule({
  declarations: [
    SarviewsResultsMenuComponent
  ],
  imports: [
    CommonModule,
    MatSharedModule,
    MatButtonToggleModule,
    FlexLayoutModule,
    SharedModule,
    SceneFilesModule,
    SceneDetailModule,
    ScenesListModule,
    ScenesListHeaderModule,

    EventProductSortSelectorModule,
  ],
  exports: [
    SarviewsResultsMenuComponent
  ]
})
export class SarviewsResultsMenuModule { }
