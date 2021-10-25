import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CreateSubscriptionModule } from '@components/header/create-subscription';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MatMomentDateModule } from '@angular/material-moment-adapter';

import { PipesModule } from '@pipes';
import { MatSharedModule } from '@shared';

import { OnDemandSubscriptionsComponent } from './on-demand-subscriptions.component';
import { OnDemandSubscriptionComponent } from './on-demand-subscription/on-demand-subscription.component';
import { SubscriptionFiltersComponent } from './on-demand-subscription/subscription-filters/subscription-filters.component';
import { SubscriptionJobOptionsComponent } from './on-demand-subscription/subscription-job-options/subscription-job-options.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';


@NgModule({
  declarations: [
    OnDemandSubscriptionsComponent,
    OnDemandSubscriptionComponent,
    SubscriptionFiltersComponent,
    SubscriptionJobOptionsComponent,
  ],
    imports: [
        CommonModule,
        FormsModule,
        PipesModule,
        MatSharedModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatSharedModule,
        MatMomentDateModule,
        CreateSubscriptionModule,
        MatSlideToggleModule,
    ],
  exports: [
    OnDemandSubscriptionsComponent,
    OnDemandSubscriptionComponent
  ],
  providers: [
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ],
})
export class OnDemandSubscriptionsModule { }
