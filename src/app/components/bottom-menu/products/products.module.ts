import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TruncateModule } from '@yellowspot/ng-truncate';
import { MatSharedModule } from '@shared';
import { ProductsComponent } from './products.component';

@NgModule({
  declarations: [ProductsComponent],
  imports: [
    CommonModule,
    MatSharedModule,
    TruncateModule,
  ],
  exports: [
    ProductsComponent
  ]
})
export class ProductsModule { }
