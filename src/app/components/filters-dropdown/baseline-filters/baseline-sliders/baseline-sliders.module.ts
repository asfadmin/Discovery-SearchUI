import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaselineSlidersComponent } from './baseline-sliders.component';
import { SharedModule } from '@shared';


@NgModule({
  declarations: [BaselineSlidersComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [BaselineSlidersComponent]
})
export class BaselineSlidersModule { }
