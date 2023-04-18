import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeExportComponent } from './code-export.component';


import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { DocsModalModule } from '../docs-modal';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSharedModule } from '@shared';

import 'prismjs/components/prism-python';
import { SharedModule } from '@shared';

@NgModule({
  declarations: [
    CodeExportComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatSharedModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatIconModule,
    MatMenuModule,
    DocsModalModule,
    SharedModule
  ],
  exports: [
    CodeExportComponent
  ]
})
export class CodeExportModule { }
