import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatSharedModule } from '@shared';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SceneFilesComponent } from './scene-files.component';
import { SceneFileModule } from './scene-file';
import { FileContentsModule } from './file-contents';
import { MatExpansionModule } from '@angular/material/expansion';
import {FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { PipesModule } from '@pipes';
import { CopyToClipboardModule } from '@components/shared/copy-to-clipboard';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OnDemandAddMenuModule } from '@components/shared/on-demand-add-menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DownloadFileButtonModule } from '@components/shared/download-file-button/download-file-button.module';
import { BurstMetadataModule } from '@components/shared/scene-metadata/burst-metadata';

@NgModule({
  declarations: [SceneFilesComponent],
  imports: [
    CommonModule,
    MatSharedModule,
    SceneFileModule,
    FileContentsModule,
    MatExpansionModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatMenuModule,
    ScrollingModule,
    PipesModule,
    CopyToClipboardModule,
    FontAwesomeModule,
    OnDemandAddMenuModule,
    MatButtonToggleModule,
    DownloadFileButtonModule,
    BurstMetadataModule
  ],
  exports: [
    SceneFilesComponent
  ]
})
export class SceneFilesModule { }
