import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  MatFormFieldModule, MatInputModule, MatTableModule,
  MatPaginatorModule, MatSortModule, MatCheckboxModule
} from '@angular/material';
import { TruncateModule } from '@yellowspot/ng-truncate';

import { MatSharedModule } from '@shared';
import { PipesModule } from '@pipes';
import { SpreadsheetComponent } from './spreadsheet.component';
import { HideIconComponent } from './hide-icon/hide-icon.component';

@NgModule({
  declarations: [SpreadsheetComponent, HideIconComponent],
  imports: [
    CommonModule,
    FormsModule,

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
  ],
  entryComponents: [
    SpreadsheetComponent
  ]
})
export class SpreadsheetModule { }
