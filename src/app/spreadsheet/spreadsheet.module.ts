import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatFormFieldModule, MatInputModule, MatTableModule,
  MatPaginatorModule, MatSortModule
} from '@angular/material';

import { MatSharedModule } from '../mat-shared.module';
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

    MatSharedModule,
  ],
  exports: [
    SpreadsheetComponent
  ]
})
export class SpreadsheetModule { }
