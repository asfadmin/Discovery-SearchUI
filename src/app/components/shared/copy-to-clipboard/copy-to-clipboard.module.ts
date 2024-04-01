import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CopyToClipboardComponent } from './copy-to-clipboard.component';

import { MatSharedModule } from '@shared';
import { MatMenuModule } from '@angular/material/menu';
import { ClipboardModule } from 'ngx-clipboard';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [CopyToClipboardComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    ClipboardModule,
    MatSharedModule,
    MatMenuModule
  ],
  exports: [CopyToClipboardComponent]
})
export class CopyToClipboardModule { }
