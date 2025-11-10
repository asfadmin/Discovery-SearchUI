import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

import { SaveSearchDialogComponent } from './save-search-dialog.component';
import { SearchFiltersModule } from '@components/sidebar/saved-searches/saved-search/search-filters';
import { SharedModule } from '@shared';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatInputModule,
    FormsModule,
    SearchFiltersModule,
    SharedModule,
    SaveSearchDialogComponent,
  ],
  exports: [SaveSearchDialogComponent],
})
export class SaveSearchDialogModule {}
