import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSharedModule } from '@shared';
import { SearchButtonComponent } from './search-button.component';

@NgModule({
  declarations: [
    SearchButtonComponent
  ],
  imports: [
    CommonModule,
    MatSharedModule,
  ],
  exports: [
    SearchButtonComponent
  ]
})
export class SearchButtonModule { }
