import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSelectModule } from '@angular/material';
import { MatSharedModule } from '@shared';

import { OtherSelectorComponent } from './other-selector.component';

@NgModule({
  declarations: [ OtherSelectorComponent ],
  imports: [
    CommonModule,
    MatSelectModule,
    MatSharedModule,
  ],
  exports: [ OtherSelectorComponent ],
})
export class OtherSelectorModule { }
