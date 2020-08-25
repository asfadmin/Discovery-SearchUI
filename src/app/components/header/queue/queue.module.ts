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

@NgModule({
  declarations: [
    QueueComponent
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
  ],
  exports: [
    QueueComponent
  ]
})
export class QueueModule { }
