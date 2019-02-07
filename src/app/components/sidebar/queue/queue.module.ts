import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSharedModule } from '@shared';

import { QueueComponent } from './queue.component';

@NgModule({
  declarations: [
    QueueComponent
  ],
  imports: [
    CommonModule,
    MatSharedModule
  ],
  exports: [
    QueueComponent
  ]
})
export class QueueModule { }
