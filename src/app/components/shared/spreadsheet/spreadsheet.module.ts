import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
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
