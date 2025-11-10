import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';

import { SeasonSelectorModule } from '@components/shared/selectors/season-selector';
import { SbasOverlapSelectorModule } from '@components/shared/selectors/sbas-overlap-selector';
import { DateSelectorModule } from '@components/shared/selectors/date-selector';
import { SbasFiltersComponent } from './sbas-filters.component';
import { MasterSceneSelectorModule } from '@components/shared/selectors/master-scene-selector';
import { SearchTypeSelectorModule } from '@components/shared/selectors/search-type-selector';
import { ResultsMenuModule } from '@components/results-menu';

import { DocsModalModule } from '@components/shared/docs-modal';
import { SharedModule } from '@shared';
import { BaselineFrameReferenceToggleComponent } from '@components/shared/selectors/baseline-frame-reference-toggle';
import { DatasetSelectorModule } from '@components/shared/selectors/dataset-selector';

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
    DatasetSelectorModule,
    BaselineFrameReferenceToggleComponent,
    SbasFiltersComponent,
  ],
  exports: [SbasFiltersComponent],
})
export class SbasFiltersModule {}
