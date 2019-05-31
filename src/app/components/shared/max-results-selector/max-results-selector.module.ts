import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatMenuModule } from '@angular/material/menu';
import { MatSharedModule } from '@shared';

import { MaxResultsSelectorComponent } from './max-results-selector.component';

@NgModule({
  declarations: [MaxResultsSelectorComponent],
  imports: [
    CommonModule,
    MatMenuModule,
    MatSharedModule
  ],
  exports: [MaxResultsSelectorComponent]
})
export class MaxResultsSelectorModule { }
