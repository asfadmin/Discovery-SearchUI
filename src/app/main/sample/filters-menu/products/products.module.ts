import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatCardModule,
  MatButtonModule,
  MatListModule,
  MatTooltipModule,
} from '@angular/material';
import { TruncateModule } from '@yellowspot/ng-truncate';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ClipboardModule } from 'ngx-clipboard';

import { ProductsComponent } from './products.component';
import { Sentinel1ProductComponent } from './sentinel1-product/sentinel1-product.component';
import { ProductNameComponent } from './sentinel1-product/product-name/product-name.component';


@NgModule({
  declarations: [
    ProductsComponent,
    Sentinel1ProductComponent,
    ProductNameComponent,
  ],
  imports: [
    CommonModule,

    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatTooltipModule,

    TruncateModule,
    FontAwesomeModule,
    ClipboardModule,
  ],
  exports: [
    ProductsComponent
  ]
})
export class ProductsModule { }
