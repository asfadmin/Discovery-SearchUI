import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatCardModule ,
  MatSelectModule ,
} from '@angular/material';

import { OtherSelectorComponent } from './other-selector.component';
import { ListClusterComponent } from './list-cluster/list-cluster.component';

@NgModule({
  declarations: [ OtherSelectorComponent, ListClusterComponent ],
  imports: [
    CommonModule,
    MatCardModule,
    MatSelectModule ,
  ],
  exports: [ OtherSelectorComponent ],
})
export class OtherSelectorModule { }
