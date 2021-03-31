import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatExpansionModule} from '@angular/material/expansion';
import { ProcessingQueueJobsComponent } from './processing-queue-jobs.component';

import { MatChipsModule } from '@angular/material/chips';
import { MatSharedModule } from '@shared';
import { PipesModule } from '@pipes';



@NgModule({
  declarations: [ProcessingQueueJobsComponent],
  imports: [
    CommonModule,
    PipesModule,
    MatSharedModule,
    MatChipsModule,
    MatExpansionModule,
  ],
  exports: [
    ProcessingQueueJobsComponent
  ]
})
export class ProcessingQueueJobsModule { }
