import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSharedModule } from '@shared';
import { CopyToClipboardModule } from '@components/shared/copy-to-clipboard';
import { TruncateModule } from '@yellowspot/ng-truncate';
import { PipesModule } from '@pipes';

import { ProductComponent } from './product.component';


@NgModule({
  declarations: [ProductComponent],
  imports: [
    CommonModule,
    MatSharedModule,
    CopyToClipboardModule,
    TruncateModule,
    PipesModule,
  ],
  exports: [
    ProductComponent
  ]
})
export class ProductModule { }
