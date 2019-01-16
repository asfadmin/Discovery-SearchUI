import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TruncateModule } from '@yellowspot/ng-truncate';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ClipboardModule } from 'ngx-clipboard';

import { MatSharedModule } from '../../mat-shared.module';

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
    MatSharedModule,

    TruncateModule,
    FontAwesomeModule,
    ClipboardModule,
  ],
  exports: [
    ProductsComponent
  ]
})
export class ProductsModule { }
