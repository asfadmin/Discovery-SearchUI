import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PipesModule } from '@pipes';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSharedModule } from '@shared';

import { SavedSearchesComponent } from './saved-searches.component';
import { SavedSearchComponent } from './saved-search/saved-search.component';
import { SearchFiltersModule } from './saved-search/search-filters';


@NgModule({
  declarations: [
    SavedSearchesComponent,
    SavedSearchComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatListModule,
    MatDialogModule,
    MatButtonToggleModule,
    MatSharedModule,
    PipesModule,
    SearchFiltersModule,
  ],
  exports: [
    SavedSearchesComponent,
  ]
})
export class SavedSearchesModule { }
