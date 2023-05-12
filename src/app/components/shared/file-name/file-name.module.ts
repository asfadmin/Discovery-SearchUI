import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TruncateModule } from '@yellowspot/ng-truncate';

import { FileNameComponent } from './file-name.component';


@NgModule({
  declarations: [ FileNameComponent ],
  imports: [
    CommonModule,
    TruncateModule,
  ],
  exports: [
    FileNameComponent
  ]
})
export class FileNameModule { }
