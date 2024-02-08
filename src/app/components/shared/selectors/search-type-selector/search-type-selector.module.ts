import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatSharedModule } from '@shared';
import { MatSelectModule } from '@angular/material/select';

import { SearchTypeSelectorComponent } from './search-type-selector.component';
import { MatMenuModule } from '@angular/material/menu';
import { DocsModalModule } from '@components/shared/docs-modal';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    SearchTypeSelectorComponent,
  ],
  imports: [
    CommonModule,
    MatSharedModule,
    FormsModule,
    MatSelectModule,
    MatMenuModule,
    DocsModalModule,
    TranslateModule,
  ],
  exports: [
    SearchTypeSelectorComponent,
  ]
})

export class SearchTypeSelectorModule {
}
