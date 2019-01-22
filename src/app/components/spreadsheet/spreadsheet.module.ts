import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatFormFieldModule, MatInputModule, MatTableModule,
  MatPaginatorModule, MatSortModule, MatCheckboxModule
} from '@angular/material';
import { TruncateModule } from '@yellowspot/ng-truncate';

import { MatSharedModule } from '@shared';
import { PipesModule } from '@pipes';
import { SpreadsheetComponent } from './spreadsheet.component';

@NgModule({
  declarations: [SpreadsheetComponent],
  imports: [
    CommonModule,

    TruncateModule,

    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,

    MatSharedModule,
    PipesModule
  ],
  exports: [
    SpreadsheetComponent
  ]
})
export class SpreadsheetModule { }
