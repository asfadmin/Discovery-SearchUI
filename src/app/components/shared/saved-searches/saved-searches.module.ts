import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatDialogModule } from '@angular/material/dialog';
import { MatSharedModule } from '@shared';

import { SavedSearchesComponent } from './saved-searches.component';


@NgModule({
  declarations: [
    SavedSearchesComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatSharedModule,
  ],
  exports: [
    SavedSearchesComponent
  ]
})
export class SavedSearchesModule { }
