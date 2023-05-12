import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { MatMenuModule } from '@angular/material/menu';

import { ClipboardModule } from 'ngx-clipboard';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TruncateModule } from '@yellowspot/ng-truncate';

import { MatSharedModule } from '@shared';
import { PipesModule } from '@pipes';
import { CopyToClipboardModule } from '@components/shared/copy-to-clipboard';

import { QueueComponent } from './queue.component';
import { ResizableModule } from 'angular-resizable-element';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialogModule } from '@angular/material/dialog';
import { ResizedEventModule } from '@directives/resized.directive';
import { FileDownloadDirective } from '@directives/file-download.directive';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import {DownloadFileButtonModule} from '@components/shared/download-file-button/download-file-button.module';
import { DownloadAllModule } from '@components/header/queue/download-all/download-all.module';
import {DocsModalModule} from '@components/shared/docs-modal';
import { SharedModule } from '@shared';


@NgModule({
  declarations: [
    QueueComponent,
    FileDownloadDirective
  ],
    imports: [
        CommonModule,
        MatMenuModule,
        ScrollingModule,
        TruncateModule,
        ClipboardModule,
        DownloadFileButtonModule,
        FontAwesomeModule,
        CopyToClipboardModule,
        MatSharedModule,
        PipesModule,
        ResizableModule,
        DragDropModule,
        MatDialogModule,
        ResizedEventModule,
        MatProgressBarModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        DownloadAllModule,
        DocsModalModule,
        SharedModule
    ],
  exports: [
    QueueComponent
  ]
})
export class QueueModule { }
