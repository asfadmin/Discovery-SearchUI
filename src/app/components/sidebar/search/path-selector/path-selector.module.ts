import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule, MatInputModule, } from '@angular/material';
import { MatSharedModule } from '@shared';

import { PathSelectorComponent } from './path-selector.component';

@NgModule({
  declarations: [PathSelectorComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatSharedModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  exports: [PathSelectorComponent],
})
export class PathSelectorModule { }
