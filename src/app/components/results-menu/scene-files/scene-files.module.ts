import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSharedModule } from '@shared';
import { SceneFilesComponent } from './scene-files.component';
import { SceneFileModule } from './scene-file';

@NgModule({
  declarations: [SceneFilesComponent],
  imports: [
    CommonModule,
    MatSharedModule,
    SceneFileModule,
  ],
  exports: [
    SceneFilesComponent
  ]
})
export class SceneFilesModule { }
