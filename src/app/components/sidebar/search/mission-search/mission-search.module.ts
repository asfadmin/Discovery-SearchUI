import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatSharedModule } from '@shared';
import {
  MatCheckboxModule, MatListModule, MatButtonToggleModule,
  MatAutocompleteModule, MatFormFieldModule, MatInputModule,
  MatPaginatorModule
} from '@angular/material';

import { MissionSearchComponent } from './mission-search.component';

@NgModule({
  declarations: [
    MissionSearchComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    MatCheckboxModule,
    MatFormFieldModule,
    MatButtonToggleModule,
    MatAutocompleteModule,
    MatListModule,
    MatInputModule,
    MatPaginatorModule,

    MatSharedModule,
  ],
  exports: [
    MissionSearchComponent
  ]
})
export class MissionSearchModule { }
