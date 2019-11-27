import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatRippleModule } from '@angular/material/core';

import { MatSharedModule } from '@shared';
import { LogoComponent } from './logo.component';
import { PipesModule } from '@pipes';

@NgModule({
  declarations: [LogoComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatRippleModule,
    MatSharedModule,
    PipesModule
  ],
  exports: [LogoComponent]
})
export class LogoModule { }
