import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSharedModule } from '@shared';

import { BottomMenuComponent } from './bottom-menu.component';

@NgModule({
  declarations: [BottomMenuComponent],
  imports: [
    CommonModule,
    MatSharedModule
  ],
  exports: [BottomMenuComponent],
})
export class BottomMenuModule { }
