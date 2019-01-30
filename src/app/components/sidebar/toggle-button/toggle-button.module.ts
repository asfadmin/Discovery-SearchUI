import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatRippleModule } from '@angular/material/core';

import { MatSharedModule } from '@shared';
import { ToggleButtonComponent } from './toggle-button.component';


@NgModule({
  declarations: [
    ToggleButtonComponent
  ],
  imports: [
    CommonModule,
    MatSharedModule,
  ],
  exports: [
    ToggleButtonComponent
  ]
})
export class ToggleButtonModule { }
