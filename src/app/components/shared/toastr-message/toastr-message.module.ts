import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrMessageComponent } from './toastr-message.component';

import { MatSharedModule } from '@shared';


@NgModule({
  declarations: [ToastrMessageComponent],
  imports: [
    CommonModule,
    ToastrMessageModule,
    MatSharedModule
  ],
  exports: [ToastrMessageComponent]
})
export class ToastrMessageModule { }
