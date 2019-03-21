import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSharedModule } from '@shared';

import { CompactSearchSelectorComponent } from './compact-search-selector.component';

@NgModule({
  declarations: [CompactSearchSelectorComponent],
  imports: [
    CommonModule,
    MatSharedModule
  ],
  exports: [CompactSearchSelectorComponent],
})
export class CompactSearchSelectorModule { }
