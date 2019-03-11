import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  MatFormFieldModule, MatInputModule, MatButtonToggleModule
} from '@angular/material';

import { MatSharedModule } from '@shared';

import { ListSearchComponent } from './list-search.component';

@NgModule({
  declarations: [
    ListSearchComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    MatSharedModule
  ],
  exports: [
    ListSearchComponent
  ]
})
export class ListSearchModule { }
