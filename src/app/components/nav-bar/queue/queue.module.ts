import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatMenuModule } from '@angular/material';

import { TruncateModule } from '@yellowspot/ng-truncate';

import { MatSharedModule } from '@shared';
import { PipesModule } from '@pipes';

import { QueueComponent } from './queue.component';

@NgModule({
  declarations: [
    QueueComponent
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    TruncateModule,

    MatSharedModule,
    PipesModule,
  ],
  exports: [
    QueueComponent
  ]
})
export class QueueModule { }
