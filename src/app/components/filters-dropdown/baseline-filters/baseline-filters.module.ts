import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';

import { SharedModule } from '@shared';
import { SeasonSelectorModule } from '@components/shared/selectors/season-selector';
import { DateSelectorModule } from '@components/shared/selectors/date-selector';
import { BaselineFiltersComponent } from './baseline-filters.component';
import { MasterSceneSelectorModule } from '@components/shared/selectors/master-scene-selector';
import { SearchTypeSelectorModule } from '@components/shared/selectors/search-type-selector';
import { BaselineSlidersModule } from './baseline-sliders';

import { DocsModalModule } from '@components/shared/docs-modal';
import { BaselineFrameReferenceToggleComponent } from '@components/shared/selectors/baseline-frame-reference-toggle';
import { DatasetSelectorModule } from '@components/shared/selectors/dataset-selector';
@NgModule({
  imports: [
    CommonModule,
    MatExpansionModule,
    SeasonSelectorModule,
    MasterSceneSelectorModule,
    DateSelectorModule,
    SearchTypeSelectorModule,
    BaselineSlidersModule,
    DocsModalModule,
    SharedModule,
    BaselineFrameReferenceToggleComponent,
    DatasetSelectorModule,
    BaselineFiltersComponent,
  ],
  exports: [BaselineFiltersComponent],
})
export class BaselineFiltersModule {}
