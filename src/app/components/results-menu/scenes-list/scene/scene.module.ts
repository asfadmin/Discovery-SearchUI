import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { SceneComponent } from './scene.component';
import { SceneControlsComponent } from './scene-controls/scene-controls.component';
import { BaselineSceneControlsComponent } from './baseline-scene-controls/baseline-scene-controls.component';

import { OnDemandAddMenuModule } from '@components/shared/on-demand-add-menu';
import { Hyp3JobStatusBadgeModule } from '@components/shared/hyp3-job-status-badge';
import { SharedModule } from '@shared';

@NgModule({
  imports: [
    CommonModule,
    MatMenuModule,
    FontAwesomeModule,
    OnDemandAddMenuModule,
    Hyp3JobStatusBadgeModule,
    SharedModule,
    SceneControlsComponent,
    BaselineSceneControlsComponent,
    SceneComponent,
  ],
  exports: [SceneComponent],
})
export class SceneModule {}
