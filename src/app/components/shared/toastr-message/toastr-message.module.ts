import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrMessageComponent } from './toastr-message.component';

import { MatSharedModule } from '@shared';


@NgModule({
  declarations: [ToastrMessageComponent],
  imports: [
    CommonModule,
    MatSharedModule
  ],
  entryComponents: [ToastrMessageComponent],
  exports: [ToastrMessageComponent]
})
export class ToastrMessageModule { }
