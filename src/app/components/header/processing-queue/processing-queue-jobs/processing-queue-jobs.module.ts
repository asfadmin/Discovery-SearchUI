import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { ProcessingQueueJobsComponent } from './processing-queue-jobs.component';
import { FormsModule } from '@angular/forms';

import { MatChipsModule } from '@angular/material/chips';

import { SharedModule } from '@shared';

@NgModule({
  imports: [
    CommonModule,
    MatSelectModule,
    MatChipsModule,
    MatExpansionModule,
    FormsModule,
    SharedModule,
    ProcessingQueueJobsComponent,
  ],
  exports: [ProcessingQueueJobsComponent],
})
export class ProcessingQueueJobsModule {}
