import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';

import { Hyp3JobStatusBadgeComponent } from './hyp3-job-status-badge.component';



@NgModule({
  declarations: [
    Hyp3JobStatusBadgeComponent
  ],
  imports: [
    CommonModule,
    MatChipsModule,
  ],
  exports: [
    Hyp3JobStatusBadgeComponent
  ]
})
export class Hyp3JobStatusBadgeModule { }
