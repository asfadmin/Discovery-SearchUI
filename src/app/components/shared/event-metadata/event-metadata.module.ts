import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventMetadataComponent } from './event-metadata.component';

import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '@shared';

@NgModule({
  imports: [
    CommonModule,
    MatMenuModule,
    MatIconModule,
    SharedModule,
    EventMetadataComponent,
  ],
  exports: [EventMetadataComponent],
})
export class EventMetadataModule {}
