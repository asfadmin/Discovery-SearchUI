import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BurstSelectorComponent } from './burst-selector.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatSharedModule } from '@shared';
import { RelativeBurstSelectorComponent } from './relative-burst-selector/relative-burst-selector.component';
import { AbsoluteBurstSelectorComponent } from './absolute-burst-selector/absolute-burst-selector.component';
import { FullBurstSelectorComponent } from './full-burst-selector/full-burst-selector.component';
@NgModule({
  declarations: [
    BurstSelectorComponent,
    RelativeBurstSelectorComponent,
    AbsoluteBurstSelectorComponent,
    FullBurstSelectorComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatInputModule,
    FormsModule,
    MatSharedModule
  ],
  exports: [
    BurstSelectorComponent
  ]
})
export class BurstSelectorModule { }
