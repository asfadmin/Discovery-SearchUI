import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { MatSharedModule } from '@shared';
import { PipesModule } from '@pipes';

import { SceneComponent } from './scene.component';
import { SceneControlsComponent } from './scene-controls/scene-controls.component';
import { BaselineSceneControlsComponent } from './baseline-scene-controls/baseline-scene-controls.component';

import { CopyToClipboardModule } from '@components/shared/copy-to-clipboard';
import { FileNameModule } from '@components/shared/file-name';
import { OnDemandAddMenuModule } from '@components/shared/on-demand-add-menu';
import { Hyp3JobStatusBadgeModule } from '@components/shared/hyp3-job-status-badge';

@NgModule({
  declarations: [
    SceneControlsComponent,
    BaselineSceneControlsComponent,
    SceneComponent,
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    MatSharedModule,

    PipesModule,
    FontAwesomeModule,
    CopyToClipboardModule,
    FileNameModule,
    OnDemandAddMenuModule,
    Hyp3JobStatusBadgeModule,
  ],
  exports: [
    SceneComponent
  ]
})
export class SceneModule { }
