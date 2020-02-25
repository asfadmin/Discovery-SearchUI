import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTreeModule } from '@angular/material/tree';

import { MatSharedModule } from '@shared';
import { FileContentsComponent } from './file-contents.component';



@NgModule({
  declarations: [ FileContentsComponent ],
  imports: [
    CommonModule,
    MatTreeModule,
    MatSharedModule,
  ],
  exports: [
    FileContentsComponent
  ]
})
export class FileContentsModule { }
