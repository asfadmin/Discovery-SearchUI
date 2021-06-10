import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';

import { MatSharedModule } from '@shared';
import { SaveUserFiltersComponent } from './save-user-filters.component';

@NgModule({
  declarations: [
    SaveUserFiltersComponent
  ],
  imports: [
    CommonModule,
    MatSharedModule,
    MatButtonToggleModule,
    MatMenuModule,
  ],
  exports: [
    SaveUserFiltersComponent
  ]
})
export class SaveUserFiltersModule { }
