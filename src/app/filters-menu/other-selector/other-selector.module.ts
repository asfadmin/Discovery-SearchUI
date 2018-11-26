import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatCardModule ,
  MatSelectModule ,
} from '@angular/material';

import { OtherSelectorComponent } from './other-selector.component';

@NgModule({
  declarations: [ OtherSelectorComponent ],
  imports: [
    CommonModule,
    MatCardModule,
    MatSelectModule ,
  ],
  exports: [ OtherSelectorComponent ],
})
export class OtherSelectorModule { }
