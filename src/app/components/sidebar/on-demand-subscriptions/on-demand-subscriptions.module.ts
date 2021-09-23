import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSharedModule } from '@shared';

import { CreateSubscriptionModule } from '@components/header/create-subscription';
import { PipesModule } from '@pipes';


import { OnDemandSubscriptionsComponent } from './on-demand-subscriptions.component';
import { OnDemandSubscriptionComponent } from './on-demand-subscription/on-demand-subscription.component';
import { SubscriptionFiltersComponent } from './on-demand-subscription/subscription-filters/subscription-filters.component';
import { SubscriptionJobOptionsComponent } from './on-demand-subscription/subscription-job-options/subscription-job-options.component';


@NgModule({
  declarations: [
    OnDemandSubscriptionsComponent,
    OnDemandSubscriptionComponent,
    SubscriptionFiltersComponent,
    SubscriptionJobOptionsComponent,
  ],
  imports: [
    CommonModule,
    PipesModule,
    MatSharedModule,
    CreateSubscriptionModule
  ],
  exports: [
    OnDemandSubscriptionsComponent,
    OnDemandSubscriptionComponent
  ]
})
export class OnDemandSubscriptionsModule { }
