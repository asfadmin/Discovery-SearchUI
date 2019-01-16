import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleButtonComponent } from './toggle-button.component';

import { MatIconModule, MatCardModule } from '@angular/material';
import { MatRippleModule } from '@angular/material/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [ ToggleButtonComponent ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    MatIconModule,
    MatRippleModule,
    MatCardModule,
  ],
  exports: [
    ToggleButtonComponent
  ]
})
export class ToggleButtonModule { }
