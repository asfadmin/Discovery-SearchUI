import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeExportComponent } from './code-export.component';

import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { DocsModalModule } from '../docs-modal';
import { MatDialogModule } from '@angular/material/dialog';

import 'prismjs/components/prism-python';
import { SharedModule } from '@shared';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatIconModule,
    MatMenuModule,
    DocsModalModule,
    SharedModule,
    CodeExportComponent,
  ],
  exports: [CodeExportComponent],
})
export class CodeExportModule {}
