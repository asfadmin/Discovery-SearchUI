import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReadableSizeFromBytesPipe } from './readable-size-from-bytes.pipe';
import { ShortDatePipe, ShortDateTimePipe, FullDatePipe } from './short-date.pipe';
import { BreakDirective } from './break.directive';


@NgModule({
  declarations: [
    ReadableSizeFromBytesPipe,
    ShortDatePipe,
    ShortDateTimePipe,
    FullDatePipe,
    BreakDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ReadableSizeFromBytesPipe,
    ShortDatePipe,
    ShortDateTimePipe,
    FullDatePipe,
    BreakDirective
  ]
})
export class PipesModule { }
