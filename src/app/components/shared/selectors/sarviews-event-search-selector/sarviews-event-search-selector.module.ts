import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { SarviewsEventSearchSelectorComponent } from './sarviews-event-search-selector.component';

import { SharedModule } from '@shared';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatAutocompleteModule,
    SharedModule,
    SarviewsEventSearchSelectorComponent,
  ],
  exports: [SarviewsEventSearchSelectorComponent],
})
export class SarviewsEventSearchSelectorModule {}
