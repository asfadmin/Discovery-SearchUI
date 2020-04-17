import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatSharedModule } from '@shared';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';

import { MissionSearchComponent } from './mission-search.component';

@NgModule({
  declarations: [
    MissionSearchComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ScrollingModule,

    MatDividerModule,
    MatChipsModule,
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
