import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';

import { SeasonSelectorModule } from '@components/shared/selectors/season-selector';
import { SbasOverlapSelectorModule } from '@components/shared/selectors/sbas-overlap-selector';
import { DateSelectorModule } from '@components/shared/selectors/date-selector';
import { MasterSceneSelectorModule } from '@components/shared/selectors/master-scene-selector';
import { SearchTypeSelectorModule } from '@components/shared/selectors/search-type-selector';
import { ResultsMenuModule } from '@components/results-menu';

import { DocsModalModule } from '@components/shared/docs-modal';
import { SharedModule } from '@shared';
import { TimeseriesFiltersComponent } from './timeseries-filters.component';

@NgModule({
  imports: [
    CommonModule,
    MatExpansionModule,
    SeasonSelectorModule,
    SbasOverlapSelectorModule,
    DateSelectorModule,
    MasterSceneSelectorModule,
    SearchTypeSelectorModule,
    ResultsMenuModule,
    DocsModalModule,
    SharedModule,
    TimeseriesFiltersComponent,
  ],
  exports: [TimeseriesFiltersComponent],
})
export class TimeseriesFiltersModule {}
