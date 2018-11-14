import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material';

import { PathSelectorComponent } from './path-selector.component';

@NgModule({
  declarations: [PathSelectorComponent],
  imports: [
    CommonModule,
    MatCardModule
  ],
  exports: [PathSelectorComponent],
})
export class PathSelectorModule { }
