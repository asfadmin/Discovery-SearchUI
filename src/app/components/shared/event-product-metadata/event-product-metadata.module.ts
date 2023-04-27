import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventProductMetadataComponent } from './event-product-metadata.component';
import { PipesModule } from '@pipes';
import { SharedModule } from '@shared';



@NgModule({
  declarations: [
    EventProductMetadataComponent
  ],
  imports: [
    CommonModule,
    PipesModule,
    SharedModule
  ],
  exports: [
    EventProductMetadataComponent
  ]
})
export class EventProductMetadataModule { }
