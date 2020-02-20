import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';

import { MatSharedModule } from '@shared';
import { SearchButtonComponent } from './search-button.component';

@NgModule({
  declarations: [
    SearchButtonComponent
  ],
  imports: [
    CommonModule,
    MatSharedModule,
    MatButtonToggleModule,
    MatMenuModule,
  ],
  exports: [
    SearchButtonComponent
  ]
})
export class SearchButtonModule { }
