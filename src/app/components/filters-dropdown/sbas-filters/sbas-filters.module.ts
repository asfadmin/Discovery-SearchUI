import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';

import { MatSharedModule } from '@shared';
import { SeasonSelectorModule } from '@components/shared/selectors/season-selector';
import { DateSelectorModule } from '@components/shared/selectors/date-selector';
import { SbasFiltersComponent } from './sbas-filters.component';
import { MasterSceneSelectorModule } from '@components/shared/selectors/master-scene-selector';
import { SearchTypeSelectorModule } from '@components/shared/selectors/search-type-selector';


@NgModule({
  declarations: [SbasFiltersComponent],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatSharedModule,
    SeasonSelectorModule,
    DateSelectorModule,
    MasterSceneSelectorModule,
    SearchTypeSelectorModule,
  ],
  exports: [
    SbasFiltersComponent
  ]
})
export class SbasFiltersModule { }
