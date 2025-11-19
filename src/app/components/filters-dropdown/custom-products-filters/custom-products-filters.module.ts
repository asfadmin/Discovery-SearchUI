import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatExpansionModule } from '@angular/material/expansion';

import { SearchTypeSelectorModule } from '@components/shared/selectors/search-type-selector';
import { ProjectNameSelectorModule } from '@components/shared/selectors/project-name-selector';
import { CustomProductsFiltersComponent } from './custom-products-filters.component';
import { JobStatusSelectorModule } from '@components/shared/selectors/job-status-selector';
import { DateSelectorModule } from '@components/shared/selectors/date-selector';
import { JobProductNameSelectorModule } from '@components/shared/selectors/job-product-name-selector';

import { JobIdSelectorComponent } from './job-id-selector/job-id-selector.component';

import { SharedModule } from '@shared';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    DateSelectorModule,
    SearchTypeSelectorModule,
    ProjectNameSelectorModule,
    JobStatusSelectorModule,
    JobProductNameSelectorModule,
    SharedModule,
    CustomProductsFiltersComponent,
    JobIdSelectorComponent,
  ],
  exports: [CustomProductsFiltersComponent],
})
export class CustomProductsFiltersModule {}
