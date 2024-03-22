import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatSelectModule } from '@angular/material/select';
import { MatSharedModule } from '@shared';

import { ShortNameSelectorComponent } from './short-name-selector.component';
import { SharedModule } from "@shared";

@NgModule({
  declarations: [
    ShortNameSelectorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatSharedModule,
    SharedModule

  ],
  exports: [
    ShortNameSelectorComponent
  ]
})
export class ShortNameSelectorModule { }
