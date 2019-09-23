import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReadableSizeFromBytesPipe } from './readable-size-from-bytes.pipe';
import { ShortDatePipe, FullDatePipe } from './short-date.pipe';


@NgModule({
  declarations: [
    ReadableSizeFromBytesPipe,
    ShortDatePipe,
    FullDatePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ReadableSizeFromBytesPipe,
    ShortDatePipe,
    FullDatePipe
  ]
})
export class PipesModule { }
