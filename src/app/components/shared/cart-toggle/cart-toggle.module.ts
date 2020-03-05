import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSharedModule } from '@shared';
import { CartToggleComponent } from './cart-toggle.component';



@NgModule({
  declarations: [CartToggleComponent],
  imports: [
    CommonModule,
    MatSharedModule
  ],
  exports: [ CartToggleComponent ]
})
export class CartToggleModule { }
