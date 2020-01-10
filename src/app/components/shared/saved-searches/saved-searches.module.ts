import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSharedModule } from '@shared';

import { SavedSearchesComponent } from './saved-searches.component';
import { SavedSearchComponent } from './saved-search/saved-search.component';


@NgModule({
  declarations: [
    SavedSearchesComponent,
    SavedSearchComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatDialogModule,
    MatSharedModule,
  ],
  exports: [
    SavedSearchesComponent
  ]
})
export class SavedSearchesModule { }
