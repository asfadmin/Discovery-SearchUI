import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReadableSizeFromBytesPipe } from './readable-size-from-bytes.pipe';
import { ShortDatePipe, ShortDateTimePipe, FullDatePipe, ShortDateSeasonPipe } from './short-date.pipe';
import { MomentPipe} from "@pipes/dynamic-moment";
import { JoinPipe } from './join.pipe';
import { BaselineFilterPipe, SBASFilterPipe, GeographicFilterPipe, ListFilterPipe } from './filter-type.pipe';
import { HTMLInputValuePipe } from './html-input-value.pipe';
import { QuakePipe, VolcanoPipe } from './sarviews-event.pipe';
import { FilterExtensionPipe } from './filter-extension.pipe';
@NgModule({
  declarations: [
    ReadableSizeFromBytesPipe,
    ShortDatePipe,
    ShortDateTimePipe,
    ShortDateSeasonPipe,
    FullDatePipe,
    MomentPipe,
    JoinPipe,
    BaselineFilterPipe,
    SBASFilterPipe,
    GeographicFilterPipe,
    ListFilterPipe,
    HTMLInputValuePipe,
    QuakePipe,
    VolcanoPipe,
    FilterExtensionPipe
    // floodPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ReadableSizeFromBytesPipe,
    ShortDatePipe,
    ShortDateTimePipe,
    ShortDateSeasonPipe,
    FullDatePipe,
    MomentPipe,
    JoinPipe,
    BaselineFilterPipe,
    SBASFilterPipe,
    GeographicFilterPipe,
    ListFilterPipe,
    HTMLInputValuePipe,
    QuakePipe,
    VolcanoPipe,
    FilterExtensionPipe,
    // floodPipe,
  ]
})
export class PipesModule { }
