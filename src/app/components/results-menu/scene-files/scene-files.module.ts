import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSharedModule } from '@shared';
import { SceneFilesComponent } from './scene-files.component';
import { SceneFileModule } from './scene-file';
import { FileContentsModule } from './file-contents';

@NgModule({
  declarations: [SceneFilesComponent],
  imports: [
    CommonModule,
    MatSharedModule,
    SceneFileModule,
    FileContentsModule,
  ],
  exports: [
    SceneFilesComponent
  ]
})
export class SceneFilesModule { }
