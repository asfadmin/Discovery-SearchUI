import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatFormFieldModule, MatInputModule } from '@angular/material';

import { MatSharedModule } from '../../mat-shared.module';
import { SearchBarComponent } from './search-bar.component';


@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,

    MatInputModule,
    MatFormFieldModule,

    MatSharedModule,
  ],
  declarations: [ SearchBarComponent ],
  exports: [ SearchBarComponent ]
})
export class SearchBarModule { }
