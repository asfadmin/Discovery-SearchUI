import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatSharedModule } from '@shared';
import { MatSelectModule } from '@angular/material/select';

import { SearchTypeSelectorComponent } from './search-type-selector.component';


@NgModule({
  declarations: [
    SearchTypeSelectorComponent,
  ],
  imports: [
    CommonModule,
    MatSharedModule,
    FormsModule,
    MatSelectModule,
    FlexLayoutModule,
  ],
  exports: [
    SearchTypeSelectorComponent,
  ]
})
export class SearchTypeSelectorModule { }
