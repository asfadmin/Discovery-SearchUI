import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TruncateModule } from '@yellowspot/ng-truncate';
import { MatSharedModule } from '@shared';
import { CopyToClipboardModule } from '@components/shared/copy-to-clipboard';
import { ProductsComponent } from './products.component';
import { PipesModule } from '@pipes';

@NgModule({
  declarations: [ProductsComponent],
  imports: [
    CommonModule,
    MatSharedModule,
    TruncateModule,
    PipesModule,
    CopyToClipboardModule,
  ],
  exports: [
    ProductsComponent
  ]
})
export class ProductsModule { }
