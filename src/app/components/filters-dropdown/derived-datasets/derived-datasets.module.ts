import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatSharedModule } from '@shared';

import { DerivedDatasetsComponent } from './derived-datasets.component';


@NgModule({
  declarations: [
    DerivedDatasetsComponent
  ],
  imports: [
    CommonModule,
    MatSharedModule,
    MatMenuModule,
  ],
  exports: [
    DerivedDatasetsComponent
  ]
})
export class DerivedDatasetsModule { }
