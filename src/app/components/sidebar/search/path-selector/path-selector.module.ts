import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule, MatInputModule, } from '@angular/material';
import { MatSharedModule } from '@shared';

import { PathSelectorComponent } from './path-selector.component';

@NgModule({
  declarations: [PathSelectorComponent],
  imports: [
    CommonModule,
    MatSharedModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  exports: [PathSelectorComponent],
})
export class PathSelectorModule { }
