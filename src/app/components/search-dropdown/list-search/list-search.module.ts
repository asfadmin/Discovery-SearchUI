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
import { PipesModule } from '@pipes';

import { ListSearchComponent } from './list-search.component';

@NgModule({
  declarations: [
    ListSearchComponent
  ],
  imports: [
    CommonModule,
    MatExpansionModule,
    SearchTypeSelectorModule,

    FormsModule,
    CopyToClipboardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    MatSharedModule,
    PipesModule,
  ],
  exports: [
    ListSearchComponent
  ]
})
export class ListSearchModule { }
