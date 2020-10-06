import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatSharedModule } from '@shared';

import { SearchTypeSelectorModule } from '@components/shared/selectors/search-type-selector';
import { ProjectNameSelectorModule } from '@components/shared/selectors/project-name-selector';
import { CustomProductsFiltersComponent } from './custom-products-filters.component';



@NgModule({
  declarations: [CustomProductsFiltersComponent],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatSharedModule,
    SearchTypeSelectorModule,
    ProjectNameSelectorModule
  ],
  exports: [
    CustomProductsFiltersComponent
  ]
})
export class CustomProductsFiltersModule { }
