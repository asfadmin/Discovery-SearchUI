import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReadableSizeFromBytesPipe } from './readable-size-from-bytes.pipe';


@NgModule({
  declarations: [
    ReadableSizeFromBytesPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ReadableSizeFromBytesPipe
  ]
})
export class PipesModule { }
