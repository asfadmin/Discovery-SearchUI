import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSharedModule } from '@shared';

import { SceneFilesModule } from '../scene-files';
import { SceneDetailModule } from '../scene-detail';
import { ScenesListModule } from '../scenes-list';
import { ScenesListHeaderModule } from '../scenes-list-header';

import { DesktopResultsMenuComponent } from './desktop-results-menu.component';
import { SharedModule } from "@shared";


@NgModule({
  declarations: [ DesktopResultsMenuComponent ],
  imports: [
    CommonModule,
    MatSharedModule,

    SceneFilesModule,
    SceneDetailModule,
    ScenesListModule,
    ScenesListHeaderModule,
    SharedModule
  ],
  exports: [
    DesktopResultsMenuComponent
  ]
})
export class DesktopResultsMenuModule { }
