import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReadableSizeFromBytesPipe } from './readable-size-from-bytes.pipe';
import { ShortDatePipe } from './short-date.pipe';


@NgModule({
  declarations: [
    ReadableSizeFromBytesPipe,
    ShortDatePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ReadableSizeFromBytesPipe,
    ShortDatePipe
  ]
})
export class PipesModule { }
