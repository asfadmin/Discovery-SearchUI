import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTreeModule } from '@angular/material/tree';
import { PipesModule } from '@pipes';
import { TruncateModule } from '@yellowspot/ng-truncate';

import { MatSharedModule } from '@shared';
import { FileNameModule } from '@components/shared/file-name';
import { FileContentsComponent } from './file-contents.component';



@NgModule({
  declarations: [ FileContentsComponent ],
  imports: [
    CommonModule,
    MatTreeModule,
    MatSharedModule,
    PipesModule,
    TruncateModule,
    FileNameModule
  ],
  exports: [
    FileContentsComponent
  ]
})
export class FileContentsModule { }
