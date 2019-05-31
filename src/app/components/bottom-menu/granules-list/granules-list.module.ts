import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';

import { TruncateModule } from '@yellowspot/ng-truncate';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatSharedModule } from '@shared';
import { PipesModule } from '@pipes';

import { GranulesListComponent } from './granules-list.component';
import { CMRProductComponent } from './sentinel1-product/sentinel1-product.component';
import { ProductNameComponent } from './sentinel1-product/product-name/product-name.component';
import { CopyToClipboardModule } from '@components/shared/copy-to-clipboard';

export class CustomMatPaginatorIntl extends MatPaginatorIntl {

  public getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 of ${length}`;
    }

    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;

    return `${startIndex + 1} - ${endIndex} of ${length} granules`; }
}

@NgModule({
  providers: [
    {provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl}
  ],
  declarations: [
    GranulesListComponent,
    CMRProductComponent,
    ProductNameComponent,
  ],
  imports: [
    CommonModule,
    ScrollDispatchModule,
    MatPaginatorModule,
    TruncateModule,
    FontAwesomeModule,
    CopyToClipboardModule,

    MatSharedModule,
    PipesModule,
  ],
  exports: [
    GranulesListComponent
  ]
})
export class GranulesListModule { }
