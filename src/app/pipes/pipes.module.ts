import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReadableSizeFromBytesPipe } from './readable-size-from-bytes.pipe';
import { ShortDatePipe, ShortDateTimePipe, FullDatePipe } from './short-date.pipe';
import { JoinPipe } from './join.pipe';
import { BaselineFilterPipe, SBASFilterPipe, GeographicFilterPipe, ListFilterPipe } from './filter-type.pipe';
import { HTMLInputValuePipe } from './html-input-value.pipe';
import { QuakePipe, VolcanoPipe } from './sarviews-event.pipe';
@NgModule({
  declarations: [
    ReadableSizeFromBytesPipe,
    ShortDatePipe,
    ShortDateTimePipe,
    FullDatePipe,
    JoinPipe,
    BaselineFilterPipe,
    SBASFilterPipe,
    GeographicFilterPipe,
    ListFilterPipe,
    HTMLInputValuePipe,
    QuakePipe,
    VolcanoPipe,
    // floodPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ReadableSizeFromBytesPipe,
    ShortDatePipe,
    ShortDateTimePipe,
    FullDatePipe,
    JoinPipe,
    BaselineFilterPipe,
    SBASFilterPipe,
    GeographicFilterPipe,
    ListFilterPipe,
    HTMLInputValuePipe,
    QuakePipe,
    VolcanoPipe,
    // floodPipe,
  ]
})
export class PipesModule { }
