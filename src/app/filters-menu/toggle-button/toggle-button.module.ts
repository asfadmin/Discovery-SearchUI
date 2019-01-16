import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleButtonComponent } from './toggle-button.component';

import { MatIconModule, MatButtonModule } from '@angular/material';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [ ToggleButtonComponent ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    MatIconModule,
    MatButtonModule,
  ],
  exports: [
    ToggleButtonComponent
  ]
})
export class ToggleButtonModule { }
