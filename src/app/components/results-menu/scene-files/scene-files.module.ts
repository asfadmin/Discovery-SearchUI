import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScrollingModule } from '@angular/cdk/scrolling';

import { MatFormFieldModule } from '@angular/material/form-field';
import { SceneFilesComponent } from './scene-files.component';
import { SceneFileModule } from './scene-file';
import { FileContentsModule } from './file-contents';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OnDemandAddMenuModule } from '@components/shared/on-demand-add-menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DownloadFileButtonModule } from '@components/shared/download-file-button/download-file-button.module';
import { SharedModule } from '@shared';

@NgModule({
  imports: [
    CommonModule,
    SceneFileModule,
    FileContentsModule,
    MatExpansionModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatMenuModule,
    ScrollingModule,
    FontAwesomeModule,
    OnDemandAddMenuModule,
    MatButtonToggleModule,
    DownloadFileButtonModule,
    SharedModule,
    SceneFilesComponent,
  ],
  exports: [SceneFilesComponent],
})
export class SceneFilesModule {}
