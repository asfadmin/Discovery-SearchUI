import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSharedModule } from '@shared';
import { PipesModule } from '@pipes';
import { Hyp3JobsDialogComponent } from './hyp3-jobs-dialog.component';


@NgModule({
  declarations: [Hyp3JobsDialogComponent],
  imports: [
    CommonModule,
    MatSharedModule,
    PipesModule
  ]
})
export class Hyp3JobsDialogModule { }
