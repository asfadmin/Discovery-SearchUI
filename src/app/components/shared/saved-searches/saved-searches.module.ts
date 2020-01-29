import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PipesModule } from '@pipes';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSharedModule } from '@shared';

import { SavedSearchesComponent } from './saved-searches.component';
import { SavedSearchComponent } from './saved-search/saved-search.component';
import { GeographicSearchFiltersComponent } from './saved-search/geographic-search-filters/geographic-search-filters.component';
import { ListSearchFiltersComponent } from './saved-search/list-search-filters/list-search-filters.component';


@NgModule({
  declarations: [
    SavedSearchesComponent,
    SavedSearchComponent,
    GeographicSearchFiltersComponent,
    ListSearchFiltersComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatListModule,
    MatDialogModule,
    MatSharedModule,
    PipesModule,
  ],
  exports: [
    SavedSearchesComponent
  ]
})
export class SavedSearchesModule { }
