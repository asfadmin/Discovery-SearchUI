import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventMetadataComponent } from './event-metadata.component';
import { PipesModule } from '@pipes';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule} from "@shared";

@NgModule({
  declarations: [
    EventMetadataComponent
  ],
  imports: [
    CommonModule,
    PipesModule,
    MatMenuModule,
    MatIconModule,
    SharedModule

  ],
  exports: [
    EventMetadataComponent
  ]
})
export class EventMetadataModule { }
