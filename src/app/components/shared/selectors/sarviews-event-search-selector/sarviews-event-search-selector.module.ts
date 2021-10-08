import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatSharedModule } from '@shared';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { SarviewsEventSearchSelectorComponent } from './sarviews-event-search-selector.component';


@NgModule({
  declarations: [
    SarviewsEventSearchSelectorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatSharedModule,
    MatInputModule,
    MatAutocompleteModule,
  ],
  exports: [
    SarviewsEventSearchSelectorComponent
  ]
})
export class SarviewsEventSearchSelectorModule { }
