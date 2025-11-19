import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';

import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';

import { SaveUserFiltersComponent } from './save-user-filters.component';
import { SearchFiltersModule } from '../saved-searches/saved-search/search-filters';
import { SaveUserFilterComponent } from './save-user-filter/save-user-filter.component';
import { SharedModule } from '@shared';

@NgModule({
  imports: [
    CommonModule,
    MatButtonToggleModule,
    MatInputModule,
    FormsModule,
    MatMenuModule,
    MatDialogModule,
    MatExpansionModule,
    SearchFiltersModule,
    SharedModule,
    SaveUserFiltersComponent,
    SaveUserFilterComponent,
  ],
  exports: [SaveUserFiltersComponent],
})
export class SaveUserFiltersModule {}
