import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatSelectModule } from '@angular/material/select';

import { JobStatusSelectorComponent } from './job-status-selector.component';
import { SharedModule } from '@shared';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    SharedModule,
    JobStatusSelectorComponent,
  ],
  exports: [JobStatusSelectorComponent],
})
export class JobStatusSelectorModule {}
