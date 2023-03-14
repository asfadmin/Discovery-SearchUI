import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SearchTypeSelectorModule } from '@components/shared/selectors/search-type-selector';

import { MatSharedModule } from '@shared';
import { CopyToClipboardModule } from '@components/shared/copy-to-clipboard';
import { NgxCsvParserModule } from 'ngx-csv-parser';

import { ListFiltersComponent } from './list-filters.component';
import {DocsModalModule} from '@components/shared/docs-modal';

@NgModule({
  declarations: [
    ListFiltersComponent
  ],
    imports: [
        CommonModule,
        MatExpansionModule,
        SearchTypeSelectorModule,

        FormsModule,
        CopyToClipboardModule,
        NgxCsvParserModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonToggleModule,
        MatSharedModule,
        DocsModalModule,
    ],
  exports: [
    ListFiltersComponent
  ]
})
export class ListFiltersModule { }
