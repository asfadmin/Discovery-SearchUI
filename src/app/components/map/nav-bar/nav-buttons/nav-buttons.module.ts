import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavButtonsComponent } from './nav-buttons.component';

@NgModule({
  declarations: [NavButtonsComponent],
  imports: [
    CommonModule
  ],
  exports: [NavButtonsComponent],
})
export class NavButtonsModule { }
