import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSharedModule } from '@shared';
import { DocsModalComponent, DocsModalIframeComponent } from './docs-modal.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from "@shared";


@NgModule({
  declarations: [
    DocsModalComponent,
    DocsModalIframeComponent,
  ],
  imports: [
    CommonModule,
    MatSharedModule,
    MatIconModule,
    MatDialogModule,
    SharedModule
  ],
  exports: [
    DocsModalComponent,
    DocsModalIframeComponent,
  ]
})
export class DocsModalModule { }
