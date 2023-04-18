import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { SharedModule } from "@shared";

import { Hyp3JobTypeSelectorComponent } from './hyp3-job-type-selector.component';


@NgModule({
  declarations: [Hyp3JobTypeSelectorComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatCheckboxModule,
    MatSelectModule,
    SharedModule
  ],
  exports: [
    Hyp3JobTypeSelectorComponent
  ]
})
export class Hyp3JobTypeSelectorModule { }
