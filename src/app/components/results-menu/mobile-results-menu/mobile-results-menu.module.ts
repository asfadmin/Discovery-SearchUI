import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { SbasResultsMenuModule } from '../sbas-results-menu/sbas-results-menu.module';

import { SceneMetadataModule } from '@components/shared/scene-metadata';
import { SceneFilesModule } from '../scene-files';
import { SceneDetailModule } from '../scene-detail';
import { ScenesListModule } from '../scenes-list';
import { ScenesListHeaderModule } from '../scenes-list-header';

import { MobileResultsMenuComponent } from './mobile-results-menu.component';
import { SharedModule } from '@shared';
import { DocsModalModule } from '@components/shared/docs-modal';

@NgModule({
  imports: [
    CommonModule,
    MatButtonToggleModule,
    SharedModule,
    SbasResultsMenuModule,
    SceneFilesModule,
    SceneMetadataModule,
    SceneDetailModule,
    ScenesListModule,
    ScenesListHeaderModule,
    DocsModalModule,
    MobileResultsMenuComponent,
  ],
  exports: [MobileResultsMenuComponent],
})
export class MobileResultsMenuModule {}
