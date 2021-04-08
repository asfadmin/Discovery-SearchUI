import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSharedModule } from '@shared';
import { FlexLayoutModule } from '@angular/flex-layout';

import { BannersComponent, BannerCreateDirective } from './banners.component';

@NgModule({
  declarations: [BannersComponent, BannerCreateDirective],
  imports: [
    CommonModule,
    MatSharedModule,
    FlexLayoutModule
  ],
  exports: [ BannersComponent, BannerCreateDirective ]
})
export class BannersModule { }
