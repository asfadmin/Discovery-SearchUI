import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SarviewsFiltersComponent } from './sarviews-filters.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { SarviewsEventSearchSelectorModule } from '@components/shared/selectors/sarviews-event-search-selector';
import { SarviewsEventTypeSelectorModule } from '@components/shared/selectors/sarviews-event-type-selector';
import { SarviewsEventActiveSelectorModule } from '@components/shared/selectors/sarviews-event-active-selector';
import { SarviewsEventMagnitudeSelectorModule } from '@components/shared/selectors/sarviews-event-magnitude-selector';
import { DateSelectorModule } from '@components/shared/selectors/date-selector';
import { MatIconModule } from '@angular/material/icon';
import {SearchTypeSelectorModule} from '@components/shared/selectors/search-type-selector';
import { PathSelectorModule } from '@components/shared/selectors/path-selector';
import { Hyp3JobTypeSelectorModule } from '@components/shared/selectors/hyp3-job-type-selector';
import {DocsModalModule} from '@components/shared/docs-modal';

@NgModule({
  declarations: [
    SarviewsFiltersComponent
  ],
    imports: [
        CommonModule,
        MatExpansionModule,
        SarviewsEventSearchSelectorModule,
        SarviewsEventTypeSelectorModule,
        SarviewsEventActiveSelectorModule,
        SarviewsEventMagnitudeSelectorModule,
        DateSelectorModule,
        MatIconModule,
        SearchTypeSelectorModule,
        PathSelectorModule,
        Hyp3JobTypeSelectorModule,
        DocsModalModule
    ],
  exports: [
    SarviewsFiltersComponent
  ]
})
export class SarviewsFiltersModule { }
