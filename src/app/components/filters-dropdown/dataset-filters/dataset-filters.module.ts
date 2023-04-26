import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatSharedModule } from '@shared';

import { PathSelectorModule } from '@components/shared/selectors/path-selector';
import { OtherSelectorModule } from '@components/shared/selectors/other-selector';
import { SeasonSelectorModule } from '@components/shared/selectors/season-selector';
import { MissionSelectorModule } from '@components/shared/selectors/mission-selector';
import { SearchTypeSelectorModule } from '@components/shared/selectors/search-type-selector';

import { DatasetFiltersComponent } from './dataset-filters.component';
import { DateSelectorModule } from '@components/shared/selectors/date-selector';
import { DatasetSelectorModule } from '@components/shared/selectors/dataset-selector';
import { AoiOptionsModule } from '@components/shared/aoi-options';
import { DocsModalModule } from '@components/shared/docs-modal';
// import { TranslateModule } from "@ngx-translate/core";
import { SharedModule } from "@shared";

@NgModule({
  declarations: [
    DatasetFiltersComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,

    MatSelectModule,
    MatExpansionModule,
    MatSharedModule,
    DocsModalModule,
    MissionSelectorModule,
    PathSelectorModule,
    OtherSelectorModule,
    SeasonSelectorModule,
    DateSelectorModule,
    DatasetSelectorModule,
    AoiOptionsModule,
    SearchTypeSelectorModule,
    SharedModule,
    // TranslateModule
  ],
  exports: [
    DatasetFiltersComponent,
  ],
})
export class DatasetFiltersModule { }
