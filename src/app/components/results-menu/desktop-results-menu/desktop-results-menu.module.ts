import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSharedModule } from '@shared';

import { SceneFilesModule } from '../scene-files';
import { SceneDetailModule } from '../scene-detail';
import { ScenesListModule } from '../scenes-list';
import { ScenesListHeaderModule } from '../scenes-list-header';

import { DesktopResultsMenuComponent } from './desktop-results-menu.component';


@NgModule({
  declarations: [ DesktopResultsMenuComponent ],
  imports: [
    CommonModule,
    MatSharedModule,

    SceneFilesModule,
    SceneDetailModule,
    ScenesListModule,
    ScenesListHeaderModule,
  ],
  exports: [
    DesktopResultsMenuComponent
  ]
})
export class DesktopResultsMenuModule { }
