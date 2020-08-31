import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';

import { MatSharedModule } from '@shared';
import { PipesModule } from '@pipes';
import { ProcessingQueueComponent } from './processing-queue.component';


@NgModule({
  declarations: [ProcessingQueueComponent],
  imports: [
    CommonModule,
    MatSharedModule,
    MatInputModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    PipesModule
  ]
})
export class ProcessingQueueModule { }
