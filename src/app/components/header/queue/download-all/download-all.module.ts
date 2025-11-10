import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownloadAllComponent } from './download-all.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { SharedModule } from '@shared';

@NgModule({
  exports: [DownloadAllComponent],
  imports: [
    CommonModule,
    MatTooltipModule,
    MatMenuModule,
    SharedModule,
    DownloadAllComponent,
  ],
})
export class DownloadAllModule {}
