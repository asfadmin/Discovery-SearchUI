import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';

import { MatSharedModule } from '@shared';
import { SearchButtonComponent } from './search-button.component';
import { SaveSearchDialogModule } from '@components/shared/save-search-dialog';
// import { CodeExportModule } from '@components/shared/code-export'
import { SharedModule } from "@shared";

@NgModule({
  declarations: [
    SearchButtonComponent
  ],
  imports: [
    CommonModule,
    MatSharedModule,
    MatButtonToggleModule,
    MatMenuModule,
    SaveSearchDialogModule,
    SharedModule,
    // CodeExportModule
  ],
  exports: [
    SearchButtonComponent
  ]
})
export class SearchButtonModule { }
