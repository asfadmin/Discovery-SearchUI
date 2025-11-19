import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { FileUploadModule } from './file-upload';
import { AoiOptionsComponent } from './aoi-options.component';
import { DrawSelectorComponent } from './draw-selector/draw-selector.component';
import { InteractionSelectorComponent } from './interaction-selector';
import { SharedModule } from '@shared';
import { GeocodeSelectorComponent } from './geocode-selector/geocode-selector.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSlideToggle } from '@angular/material/slide-toggle';

@NgModule({
  imports: [
    CommonModule,
    MatButtonToggleModule,
    FormsModule,
    MatInputModule,
    MatMenuModule,
    FileUploadModule,
    SharedModule,
    MatAutocompleteModule,
    MatSlideToggle,
    AoiOptionsComponent,
    DrawSelectorComponent,
    InteractionSelectorComponent,
    GeocodeSelectorComponent,
  ],
  exports: [
    AoiOptionsComponent,
    DrawSelectorComponent,
    InteractionSelectorComponent,
  ],
})
export class AoiOptionsModule {}
