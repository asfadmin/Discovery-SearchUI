import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';

import { OnDemandAddMenuComponent } from './on-demand-add-menu.component';
import { ClosestPairComponent } from './closest-pair/closest-pair.component';

import { SharedModule } from '@shared';

@NgModule({
  imports: [
    CommonModule,
    MatMenuModule,
    MatInputModule,
    FormsModule,
    SharedModule,
    OnDemandAddMenuComponent,
    ClosestPairComponent,
  ],
  exports: [OnDemandAddMenuComponent],
})
export class OnDemandAddMenuModule {}
