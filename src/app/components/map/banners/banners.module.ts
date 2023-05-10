import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSharedModule } from '@shared';

import { BannersComponent, BannerCreateDirective } from './banners.component';
import { BannerDialogComponent } from './banner-dialog/banner-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';

@NgModule({
  declarations: [
    BannersComponent,
    BannerCreateDirective,
    BannerDialogComponent
  ],
  imports: [
    CommonModule,
    MatSharedModule,
    MatDialogModule
  ],
    exports: [BannersComponent, BannerCreateDirective, BannerDialogComponent]
})
export class BannersModule { }
