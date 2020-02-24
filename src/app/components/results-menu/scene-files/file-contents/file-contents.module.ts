import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTreeModule } from '@angular/material/tree';

import { FileContentsComponent } from './file-contents.component';



@NgModule({
  declarations: [ FileContentsComponent ],
  imports: [
    CommonModule,
    MatTreeModule
  ]
})
export class FileContentsModule { }
