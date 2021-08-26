import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSharedModule } from '@shared';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SceneFilesComponent } from './scene-files.component';
import { SceneFileModule } from './scene-file';
import { FileContentsModule } from './file-contents';
import { MatExpansionModule } from '@angular/material/expansion';
import {FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

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
  ],
  exports: [
    SceneFilesComponent
  ]
})
export class SceneFilesModule { }
