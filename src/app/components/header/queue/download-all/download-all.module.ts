import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownloadAllComponent } from './download-all.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';



@NgModule({
  declarations: [
    DownloadAllComponent
  ],
  exports: [
    DownloadAllComponent
  ],
  imports: [
    CommonModule,
    MatTooltipModule,
    MatMenuModule
  ]
})
export class DownloadAllModule { }
