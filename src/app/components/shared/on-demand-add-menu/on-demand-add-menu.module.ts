import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatSharedModule } from '@shared';

import { OnDemandAddMenuComponent } from './on-demand-add-menu.component';


@NgModule({
  declarations: [OnDemandAddMenuComponent],
  imports: [
    CommonModule,
    MatMenuModule,
    MatSharedModule,
  ],
  exports: [ OnDemandAddMenuComponent ]
})
export class OnDemandAddMenuModule { }
