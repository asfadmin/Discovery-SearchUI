import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTreeModule } from '@angular/material/tree';

import { TruncateModule } from '@yellowspot/ng-truncate';

import { CartToggleModule } from '@components/shared/cart-toggle';

import { FileContentsComponent } from './file-contents.component';
import { DownloadFileButtonModule } from '@components/shared/download-file-button/download-file-button.module';

@NgModule({
  imports: [
    CommonModule,
    MatTreeModule,
    TruncateModule,
    CartToggleModule,
    DownloadFileButtonModule,
    FileContentsComponent,
  ],
  exports: [FileContentsComponent],
})
export class FileContentsModule {}
