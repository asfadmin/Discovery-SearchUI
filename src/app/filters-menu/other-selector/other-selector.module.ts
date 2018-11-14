import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material';

import { OtherSelectorComponent } from './other-selector.component';

@NgModule({
  declarations: [ OtherSelectorComponent ],
  imports: [
    CommonModule,
    MatCardModule
  ],
  exports: [ OtherSelectorComponent ],
})
export class OtherSelectorModule { }
