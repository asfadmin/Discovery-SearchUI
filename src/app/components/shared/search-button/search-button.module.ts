import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';

import { SearchButtonComponent } from './search-button.component';
import { SaveSearchDialogModule } from '@components/shared/save-search-dialog';
// import { CodeExportModule } from '@components/shared/code-export'
import { SharedModule } from '@shared';

@NgModule({
  imports: [
    CommonModule,
    MatButtonToggleModule,
    MatMenuModule,
    SaveSearchDialogModule,
    SharedModule,
    SearchButtonComponent,
  ],
  exports: [SearchButtonComponent],
})
export class SearchButtonModule {}
