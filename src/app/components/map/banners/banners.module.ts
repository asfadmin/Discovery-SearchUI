import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSharedModule } from '@shared';
import { FlexLayoutModule } from '@angular/flex-layout';

import { BannersComponent } from './banners.component';


@NgModule({
  declarations: [BannersComponent],
  imports: [
    CommonModule,
    MatSharedModule,
    FlexLayoutModule
  ],
  exports: [ BannersComponent ]
})
export class BannersModule { }
