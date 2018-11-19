import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
} from '@angular/material';

import { PathSelectorComponent } from './path-selector.component';

@NgModule({
  declarations: [PathSelectorComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  exports: [PathSelectorComponent],
})
export class PathSelectorModule { }
