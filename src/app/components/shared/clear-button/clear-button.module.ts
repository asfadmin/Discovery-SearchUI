import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSharedModule } from '@shared';
import { ClearButtonComponent } from './clear-button.component';
import { SharedModule } from "@shared";

@NgModule({
  declarations: [
    ClearButtonComponent
  ],
  imports: [
    CommonModule,
    MatSharedModule,
    SharedModule
  ],
  exports: [
    ClearButtonComponent
  ]
})
export class ClearButtonModule { }
