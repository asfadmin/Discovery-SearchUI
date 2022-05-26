import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

import { MatSharedModule } from '@shared';

import { SaveSearchDialogComponent } from './save-search-dialog.component';
import { SearchFiltersModule } from '@components/sidebar/saved-searches/saved-search/search-filters';


@NgModule({
  declarations: [
    SaveSearchDialogComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatInputModule,
    FormsModule,
    MatSharedModule,
    SearchFiltersModule,
  ],
  exports: [
    SaveSearchDialogComponent
  ]
})
export class SaveSearchDialogModule { }
