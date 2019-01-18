import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatFormFieldModule, MatInputModule, MatTableModule,
  MatPaginatorModule, MatSortModule, MatCheckboxModule
} from '@angular/material';

import { MatSharedModule } from '@shared';
import { SpreadsheetComponent } from './spreadsheet.component';

@NgModule({
  declarations: [SpreadsheetComponent],
  imports: [
    CommonModule,

    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,

    MatSharedModule,
  ],
  exports: [
    SpreadsheetComponent
  ]
})
export class SpreadsheetModule { }
