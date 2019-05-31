import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
