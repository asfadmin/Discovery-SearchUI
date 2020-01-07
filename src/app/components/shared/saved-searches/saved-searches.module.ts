import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SavedSearchesComponent } from './saved-searches.component';



@NgModule({
  declarations: [
    SavedSearchesComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SavedSearchesComponent
  ]
})
export class SavedSearchesModule { }
