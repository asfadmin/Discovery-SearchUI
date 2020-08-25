import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { MatSharedModule } from '@shared';
import { SceneFilesComponent } from './scene-files.component';
import { SceneFileModule } from './scene-file';
import { FileContentsModule } from './file-contents';

@NgModule({
  declarations: [SceneFilesComponent],
  imports: [
    CommonModule,
    MatSharedModule,
    MatSnackBarModule,
    SceneFileModule,
    FileContentsModule,
  ],
  exports: [
    SceneFilesComponent
  ]
})
export class SceneFilesModule { }
