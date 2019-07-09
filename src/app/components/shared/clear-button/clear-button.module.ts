import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSharedModule } from '@shared';
import { ClearButtonComponent } from './clear-button.component';

@NgModule({
  declarations: [
    ClearButtonComponent
  ],
  imports: [
    CommonModule,
    MatSharedModule,
  ],
  exports: [
    ClearButtonComponent
  ]
})
export class ClearButtonModule { }
