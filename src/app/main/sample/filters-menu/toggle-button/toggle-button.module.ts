import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleButtonComponent } from './toggle-button.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [ ToggleButtonComponent ],
  imports: [
    CommonModule,
    FontAwesomeModule,
  ],
  exports: [
    ToggleButtonComponent
  ]
})
export class ToggleButtonModule { }
