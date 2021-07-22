import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownloadFileButtonComponent } from './download-file-button.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [
    DownloadFileButtonComponent
  ],
  exports: [
    DownloadFileButtonComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatIconModule
  ]
})
export class DownloadFileButtonModule { }
