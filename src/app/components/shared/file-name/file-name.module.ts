import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TruncateModule } from '@yellowspot/ng-truncate';
import { FlexLayoutModule } from '@angular/flex-layout';

import { FileNameComponent } from './file-name.component';


@NgModule({
  declarations: [ FileNameComponent ],
  imports: [
    CommonModule,
    TruncateModule,
    FlexLayoutModule,
  ],
  exports: [
    FileNameComponent
  ]
})
export class FileNameModule { }
