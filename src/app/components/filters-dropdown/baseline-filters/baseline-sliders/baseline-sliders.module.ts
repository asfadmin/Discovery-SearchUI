import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaselineSlidersComponent } from './baseline-sliders.component';



@NgModule({
  declarations: [BaselineSlidersComponent],
  imports: [
    CommonModule
  ],
  exports: [BaselineSlidersComponent]
})
export class BaselineSlidersModule { }
