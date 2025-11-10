import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatSelectModule } from '@angular/material/select';

import { ShortNameSelectorComponent } from './short-name-selector.component';
import { SharedModule } from '@shared';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    SharedModule,
    ShortNameSelectorComponent,
  ],
  exports: [ShortNameSelectorComponent],
})
export class ShortNameSelectorModule {}
