import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventMetadataComponent } from './event-metadata.component';
import { PipesModule } from '@pipes';


@NgModule({
  declarations: [
    EventMetadataComponent
  ],
  imports: [
    CommonModule,
    PipesModule
  ],
  exports: [
    EventMetadataComponent
  ]
})
export class EventMetadataModule { }
