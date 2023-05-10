import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatSharedModule } from '@shared';

import { DerivedDatasetsComponent } from './derived-datasets.component';
import { SharedModule } from '@shared';

@NgModule({
  declarations: [
    DerivedDatasetsComponent
  ],
  imports: [
    CommonModule,
    MatSharedModule,
    MatExpansionModule,
    MatMenuModule,
    SharedModule
  ],
  exports: [
    DerivedDatasetsComponent
  ]
})
export class DerivedDatasetsModule { }
