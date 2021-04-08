import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { TruncateModule } from '@yellowspot/ng-truncate';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';

import { MatSharedModule } from '@shared';
import { PipesModule } from '@pipes';

import { CopyToClipboardModule } from '@components/shared/copy-to-clipboard';
import { FileNameModule } from '@components/shared/file-name';
import { ScenesListComponent } from './scenes-list.component';
import { SceneComponent } from './scene/scene.component';
import { Hyp3JobComponent } from './hyp3-job/hyp3-job.component';


@NgModule({
  declarations: [
    ScenesListComponent,
    SceneComponent,
    Hyp3JobComponent,
  ],
  imports: [
    CommonModule,
    ScrollingModule,
    MatBadgeModule,
    MatChipsModule,
    TruncateModule,
    FontAwesomeModule,
    CopyToClipboardModule,
    MatSharedModule,
    MatMenuModule,
    PipesModule,
    FileNameModule
  ],
  exports: [
    ScenesListComponent
  ]
})
export class ScenesListModule { }
