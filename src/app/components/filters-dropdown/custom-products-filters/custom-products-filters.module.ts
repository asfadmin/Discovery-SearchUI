import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatSharedModule } from '@shared';

import { SearchTypeSelectorModule } from '@components/shared/selectors/search-type-selector';
import { ProjectNameSelectorModule } from '@components/shared/selectors/project-name-selector';
import { CustomProductsFiltersComponent } from './custom-products-filters.component';
import { JobStatusSelectorModule } from '@components/shared/selectors/job-status-selector';
import { DateSelectorModule } from '@components/shared/selectors/date-selector';
import { JobProductNameSelectorModule } from '@components/shared/selectors/job-product-name-selector';
import { OnDemandUserSelectorModule} from '@components/shared/selectors/on-demand-user-selector';

import { SharedModule } from '@shared';

@NgModule({
  declarations: [CustomProductsFiltersComponent],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatSharedModule,
    DateSelectorModule,
    SearchTypeSelectorModule,
    ProjectNameSelectorModule,
    JobStatusSelectorModule,
    JobProductNameSelectorModule,
    OnDemandUserSelectorModule,
    SharedModule
  ],
  exports: [
    CustomProductsFiltersComponent
  ]
})
export class CustomProductsFiltersModule { }
