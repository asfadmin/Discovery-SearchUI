import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TruncateModule } from '@yellowspot/ng-truncate';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatMenuModule } from '@angular/material';

import { PipesModule } from '@pipes';
import { MatSharedModule } from '@shared';
import { ScenesListModule } from './scenes-list';
import { ResultsMenuComponent } from './results-menu.component';
import { SceneFilesModule } from './scene-files';
import { SceneDetailModule } from './scene-detail';

@NgModule({
  declarations: [ResultsMenuComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    TruncateModule,
    MatMenuModule,
    MatSharedModule,
    PipesModule,
    ScenesListModule,
    SceneFilesModule,
    SceneDetailModule
  ],
  exports: [ResultsMenuComponent],
})
export class ResultsMenuModule { }
