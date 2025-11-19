import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartToggleComponent } from './cart-toggle.component';
import { SharedModule } from '@shared';

@NgModule({
  imports: [CommonModule, SharedModule, CartToggleComponent],
  exports: [CartToggleComponent],
})
export class CartToggleModule {}
