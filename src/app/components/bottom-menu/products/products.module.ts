import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSharedModule } from '@shared';
import { ProductsComponent } from './products.component';
import { ProductModule } from './product';

@NgModule({
  declarations: [ProductsComponent],
  imports: [
    CommonModule,
    MatSharedModule,
    ProductModule,
  ],
  exports: [
    ProductsComponent
  ]
})
export class ProductsModule { }
