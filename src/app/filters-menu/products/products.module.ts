import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material';
import { TruncateModule } from '@yellowspot/ng-truncate';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ProductsComponent } from './products.component';
import { Sentinel1ProductComponent } from './sentinel1-product/sentinel1-product.component';


@NgModule({
  declarations: [
    ProductsComponent,
    Sentinel1ProductComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    TruncateModule,
    FontAwesomeModule,
  ],
  exports: [
    ProductsComponent
  ]
})
export class ProductsModule { }
