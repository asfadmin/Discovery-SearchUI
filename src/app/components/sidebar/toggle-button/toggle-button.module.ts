import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleButtonComponent } from './toggle-button.component';

import { MatRippleModule } from '@angular/material/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { MatSharedModule } from '@shared';


@NgModule({
  declarations: [ ToggleButtonComponent ],
  imports: [
    CommonModule,
    FontAwesomeModule,

    MatSharedModule,
  ],
  exports: [
    ToggleButtonComponent
  ]
})
export class ToggleButtonModule { }
