import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSharedModule } from '@shared';
import { CartToggleComponent } from './cart-toggle.component';
import { SharedModule } from "@shared";


@NgModule({
  declarations: [CartToggleComponent],
  imports: [
    CommonModule,
    MatSharedModule,
    SharedModule,
  ],
  exports: [ CartToggleComponent ]
})
export class CartToggleModule { }
