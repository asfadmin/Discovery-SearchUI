import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSharedModule } from '@shared';

import { OtherSelectorComponent } from './other-selector.component';

@NgModule({
  declarations: [ OtherSelectorComponent ],
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatSharedModule,
  ],
  exports: [ OtherSelectorComponent ],
})
export class OtherSelectorModule { }
