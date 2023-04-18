import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchSelectorComponent } from './search-selector.component';

import { MatExpansionModule } from '@angular/material/expansion';

import { MatSharedModule } from '@shared';
import {SharedModule} from "@shared";

@NgModule({
  declarations: [
    SearchSelectorComponent
  ],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatSharedModule,
    SharedModule
  ],
  exports: [SearchSelectorComponent],
})
export class SearchSelectorModule { }
