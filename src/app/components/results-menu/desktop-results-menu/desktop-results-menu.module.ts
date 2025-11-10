import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SceneFilesModule } from '../scene-files';
import { SceneDetailModule } from '../scene-detail';
import { ScenesListModule } from '../scenes-list';
import { ScenesListHeaderModule } from '../scenes-list-header';

import { DesktopResultsMenuComponent } from './desktop-results-menu.component';
import { SharedModule } from '@shared';

@NgModule({
  imports: [
    CommonModule,
    SceneFilesModule,
    SceneDetailModule,
    ScenesListModule,
    ScenesListHeaderModule,
    SharedModule,
    DesktopResultsMenuComponent,
  ],
  exports: [DesktopResultsMenuComponent],
})
export class DesktopResultsMenuModule {}
