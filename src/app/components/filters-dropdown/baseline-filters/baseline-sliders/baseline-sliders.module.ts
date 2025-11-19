import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaselineSlidersComponent } from './baseline-sliders.component';
import { SharedModule } from '@shared';

@NgModule({
  imports: [CommonModule, SharedModule, BaselineSlidersComponent],
  exports: [BaselineSlidersComponent],
})
export class BaselineSlidersModule {}
