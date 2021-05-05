import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatSharedModule } from '@shared';
import { FormsModule } from '@angular/forms';
import { OnDemandAddMenuComponent } from './on-demand-add-menu.component';
import { ClosestPairComponent } from './closest-pair/closest-pair.component';
import {MatInputModule} from '@angular/material/input';

@NgModule({
  declarations: [OnDemandAddMenuComponent, ClosestPairComponent],
  imports: [
    CommonModule,
    MatMenuModule,
    MatSharedModule,
    MatInputModule,
    FormsModule
  ],
  exports: [ OnDemandAddMenuComponent ]
})
export class OnDemandAddMenuModule { }
