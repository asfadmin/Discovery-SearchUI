import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { MatMenuModule } from '@angular/material/menu';
import { FlexLayoutModule } from '@angular/flex-layout';

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
import { AngularResizedEventModule } from 'angular-resize-event';
import { FileDownloadDirective } from '@directives/file-download.directive';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCheckboxModule} from '@angular/material/checkbox';


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
        FontAwesomeModule,
        CopyToClipboardModule,
        MatSharedModule,
        PipesModule,
        FlexLayoutModule,
        ResizableModule,
        DragDropModule,
        MatDialogModule,
        AngularResizedEventModule,
        MatProgressBarModule,
        MatCheckboxModule
    ],
  exports: [
    QueueComponent
  ]
})
export class QueueModule { }
