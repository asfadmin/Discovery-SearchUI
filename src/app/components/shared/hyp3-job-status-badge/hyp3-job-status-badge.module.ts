import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { Hyp3JobStatusBadgeComponent } from './hyp3-job-status-badge.component';
import { SharedModule } from "@shared";


@NgModule({
  declarations: [
    Hyp3JobStatusBadgeComponent
  ],
  imports: [
    CommonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatMenuModule,
    MatButtonModule,
    SharedModule
  ],
  exports: [
    Hyp3JobStatusBadgeComponent
  ]
})
export class Hyp3JobStatusBadgeModule { }
