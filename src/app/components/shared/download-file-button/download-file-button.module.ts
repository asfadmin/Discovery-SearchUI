import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownloadFileButtonComponent } from './download-file-button.component';



@NgModule({
  declarations: [
    DownloadFileButtonComponent
  ],
  exports: [
    DownloadFileButtonComponent
  ],
  imports: [
    CommonModule
  ]
})
export class DownloadFileButtonModule { }
