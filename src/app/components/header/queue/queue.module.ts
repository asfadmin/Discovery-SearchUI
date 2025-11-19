import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { MatMenuModule } from '@angular/material/menu';

import { ClipboardModule } from 'ngx-clipboard';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TruncateModule } from '@yellowspot/ng-truncate';

import { QueueComponent } from './queue.component';
import { ResizableModule } from 'angular-resizable-element';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialogModule } from '@angular/material/dialog';

import { FileDownloadDirective } from '@directives/file-download.directive';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { DownloadFileButtonModule } from '@components/shared/download-file-button/download-file-button.module';
import { DownloadAllModule } from '@components/header/queue/download-all/download-all.module';
import { DocsModalModule } from '@components/shared/docs-modal';
import { SharedModule } from '@shared';

@NgModule({
  imports: [
    CommonModule,
    MatMenuModule,
    ScrollingModule,
    TruncateModule,
    ClipboardModule,
    DownloadFileButtonModule,
    FontAwesomeModule,
    ResizableModule,
    DragDropModule,
    MatDialogModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    DownloadAllModule,
    DocsModalModule,
    SharedModule,
    QueueComponent,
    FileDownloadDirective,
  ],
  exports: [QueueComponent],
})
export class QueueModule {}
