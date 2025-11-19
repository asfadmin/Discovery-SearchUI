import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventProductMetadataComponent } from './event-product-metadata.component';

import { SharedModule } from '@shared';

@NgModule({
  imports: [CommonModule, SharedModule, EventProductMetadataComponent],
  exports: [EventProductMetadataComponent],
})
export class EventProductMetadataModule {}
