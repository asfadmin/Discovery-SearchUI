import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { SceneDetailModule } from '../scene-detail';
import { ScenesListModule } from '../scenes-list';
import { SceneFilesModule } from '../scene-files';
import { ScenesListHeaderModule } from '../scenes-list-header/scenes-list-header.module';

import { EventProductSortSelectorModule } from '@components/shared/event-product-sort-selector';

import { SarviewsResultsMenuComponent } from './sarviews-results-menu.component';

import { SharedModule } from '@shared';

@NgModule({
  imports: [
    CommonModule,
    MatButtonToggleModule,
    SharedModule,
    SceneFilesModule,
    SceneDetailModule,
    ScenesListModule,
    ScenesListHeaderModule,
    EventProductSortSelectorModule,
    SarviewsResultsMenuComponent,
  ],
  exports: [SarviewsResultsMenuComponent],
})
export class SarviewsResultsMenuModule {}
