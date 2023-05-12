import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';

import { MatSharedModule } from '@shared';
import { LogoComponent } from './logo.component';

@NgModule({
  declarations: [LogoComponent],
  imports: [
    CommonModule,
    MatRippleModule,
    MatSharedModule,
  ],
  exports: [LogoComponent]
})
export class LogoModule { }
