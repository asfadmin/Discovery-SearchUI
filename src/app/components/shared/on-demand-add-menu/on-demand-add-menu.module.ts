import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';

import { MatSharedModule } from '@shared';

import { OnDemandAddMenuComponent } from './on-demand-add-menu.component';
import { ClosestPairComponent } from './closest-pair/closest-pair.component';

import { CreateSubscriptionModule } from '@components/header/create-subscription';
import { SharedModule } from '@shared';

@NgModule({
  declarations: [OnDemandAddMenuComponent, ClosestPairComponent],
  imports: [
    CommonModule,
    MatMenuModule,
    MatSharedModule,
    MatInputModule,
    FormsModule,
    CreateSubscriptionModule,
    SharedModule
  ],
  exports: [ OnDemandAddMenuComponent ]
})
export class OnDemandAddMenuModule { }
