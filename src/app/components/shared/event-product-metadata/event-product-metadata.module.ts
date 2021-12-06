import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventProductMetadataComponent } from './event-product-metadata.component';
import { PipesModule } from '@pipes';


@NgModule({
  declarations: [
    EventProductMetadataComponent
  ],
  imports: [
    CommonModule,
    PipesModule
  ],
  exports: [
    EventProductMetadataComponent
  ]
})
export class EventProductMetadataModule { }
