import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SearchTypeSelectorModule } from '@components/shared/selectors/search-type-selector';

import { NgxCsvParserModule } from 'ngx-csv-parser';

import { ListFiltersComponent } from './list-filters.component';
import { DocsModalModule } from '@components/shared/docs-modal';
import { SharedModule } from '@shared';

@NgModule({
  imports: [
    CommonModule,
    MatExpansionModule,
    SearchTypeSelectorModule,
    FormsModule,
    NgxCsvParserModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    DocsModalModule,
    SharedModule,
    ListFiltersComponent,
  ],
  exports: [ListFiltersComponent],
})
export class ListFiltersModule {}
