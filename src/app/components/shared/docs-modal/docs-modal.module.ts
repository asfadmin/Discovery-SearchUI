import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  DocsModalComponent,
  DocsModalIframeComponent,
} from './docs-modal.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '@shared';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    SharedModule,
    DocsModalComponent,
    DocsModalIframeComponent,
  ],
  exports: [DocsModalComponent, DocsModalIframeComponent],
})
export class DocsModalModule {}
