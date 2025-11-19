import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClearButtonComponent } from './clear-button.component';
import { SharedModule } from '@shared';

@NgModule({
  imports: [CommonModule, SharedModule, ClearButtonComponent],
  exports: [ClearButtonComponent],
})
export class ClearButtonModule {}
