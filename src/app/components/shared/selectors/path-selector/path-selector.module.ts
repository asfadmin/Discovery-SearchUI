import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { PathSelectorComponent } from './path-selector.component';
import { AoiClearComponent } from './aoi-clear/aoi-clear.component';
import { SharedModule } from '@shared';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    SharedModule,
    PathSelectorComponent,
    AoiClearComponent,
  ],
  exports: [PathSelectorComponent],
})
export class PathSelectorModule {}
