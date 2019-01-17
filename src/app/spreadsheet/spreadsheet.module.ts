import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule, MatInputModule, MatTableModule, MatPaginatorModule } from '@angular/material';

import { MatSharedModule } from '../mat-shared.module';
import { SpreadsheetComponent } from './spreadsheet.component';

@NgModule({
  declarations: [SpreadsheetComponent],
  imports: [
    CommonModule,

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
