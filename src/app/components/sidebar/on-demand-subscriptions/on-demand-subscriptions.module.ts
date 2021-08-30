import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSharedModule } from '@shared';

import { CreateSubscriptionModule } from '@components/header/create-subscription';

import { OnDemandSubscriptionsComponent } from './on-demand-subscriptions.component';
import { OnDemandSubscriptionComponent } from './on-demand-subscription/on-demand-subscription.component';


@NgModule({
  declarations: [
    OnDemandSubscriptionsComponent,
    OnDemandSubscriptionComponent
  ],
  imports: [
    CommonModule,
    MatSharedModule,
    CreateSubscriptionModule
  ],
  exports: [
    OnDemandSubscriptionsComponent,
    OnDemandSubscriptionComponent
  ]
})
export class OnDemandSubscriptionsModule { }
