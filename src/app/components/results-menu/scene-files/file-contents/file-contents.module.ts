import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTreeModule } from '@angular/material/tree';
import { PipesModule } from '@pipes';
import { TruncateModule } from '@yellowspot/ng-truncate';

import { MatSharedModule } from '@shared';
import { FileNameModule } from '@components/shared/file-name';
import { CartToggleModule } from '@components/shared/cart-toggle';

import { FileContentsComponent } from './file-contents.component';
import {DownloadFileButtonModule} from '@components/shared/download-file-button/download-file-button.module';



@NgModule({
  declarations: [ FileContentsComponent ],
  imports: [
    CommonModule,
    MatTreeModule,
    MatSharedModule,
    PipesModule,
    TruncateModule,
    FileNameModule,
    CartToggleModule,
    DownloadFileButtonModule,
  ],
  exports: [
    FileContentsComponent
  ]
})
export class FileContentsModule { }
