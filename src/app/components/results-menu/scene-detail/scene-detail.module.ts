import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatMenuModule } from '@angular/material';
import { TruncateModule } from '@yellowspot/ng-truncate';
import { FlexLayoutModule } from '@angular/flex-layout';

import { PipesModule } from '@pipes';
import { MatSharedModule } from '@shared';
import { CopyToClipboardModule } from '@components/shared/copy-to-clipboard';
import { SceneMetadataModule } from '@components/shared/scene-metadata';
import { ImageDialogModule } from './image-dialog';
import { SceneDetailComponent } from './scene-detail.component';


@NgModule({
  declarations: [SceneDetailComponent],
  imports: [
    CommonModule,
    MatMenuModule,
    FlexLayoutModule,
    TruncateModule,
    MatSharedModule,
    PipesModule,
    CopyToClipboardModule,
    ImageDialogModule,
    SceneMetadataModule
  ],
  exports: [SceneDetailComponent],
})
export class SceneDetailModule { }
