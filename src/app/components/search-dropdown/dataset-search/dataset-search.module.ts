import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatSharedModule } from '@shared';

import { PathSelectorModule } from '@components/shared/selectors/path-selector';
import { OtherSelectorModule } from '@components/shared/selectors/other-selector';
import { SeasonSelectorModule } from '@components/shared/selectors/season-selector';
import { MissionSearchModule } from '../mission-search';
import { SearchTypeSelectorModule } from '@components/shared/selectors/search-type-selector';
import { PipesModule } from '@pipes';

import { DatasetSearchComponent } from './dataset-search.component';
import { DateSelectorModule } from '@components/shared/selectors/date-selector';
import { DatasetSelectorModule } from '@components/shared/selectors/dataset-selector';
import { AoiOptionsModule } from '@components/shared/aoi-options';

@NgModule({
  declarations: [
    DatasetSearchComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,

    MatSelectModule,
    MatExpansionModule,
    MatSharedModule,

    MissionSearchModule,
    PathSelectorModule,
    OtherSelectorModule,
    SeasonSelectorModule,
    DateSelectorModule,
    DatasetSelectorModule,
    AoiOptionsModule,
    SearchTypeSelectorModule,
    PipesModule,
  ],
  exports: [
    DatasetSearchComponent,
  ],
})
export class DatasetSearchModule { }
