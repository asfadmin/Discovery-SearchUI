import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatSharedModule } from '@shared';

import { SearchFiltersModule } from '@components/sidebar/saved-searches/saved-search/search-filters';
import { DateSelectorModule } from '@components/shared/selectors/date-selector';
import { ProjectNameSelectorModule } from '@components/shared/selectors/project-name-selector';
import { ProductTypeSelectorModule } from '@components/shared/selectors/product-type-selector';
import { AoiOptionsModule } from '@components/shared/aoi-options';

import { CreateSubscriptionComponent } from './create-subscription.component';
import { ProcessingOptionsModule } from '../processing-queue/processing-options';
import { DateRangeModule } from '@components/shared/selectors/date-range/date-range.module';

import { MatDialogModule } from '@angular/material/dialog';
import { PipesModule } from '@pipes';
import { SubscriptionDateRangeComponent } from './subscription-date-range/subscription-date-range.component';
import {FlexModule} from '@angular/flex-layout';

@NgModule({
  declarations: [
    CreateSubscriptionComponent,
    SubscriptionDateRangeComponent
  ],
    imports: [
        CommonModule,
        FormsModule,
        MatDialogModule,
        MatSelectModule,
        MatStepperModule,
        MatSlideToggleModule,
        MatInputModule,
        MatSharedModule,
        ProcessingOptionsModule,
        SearchFiltersModule,
        DateSelectorModule,
        ProjectNameSelectorModule,
        ProductTypeSelectorModule,
        AoiOptionsModule,
        DateRangeModule,
        PipesModule,
        FlexModule,
    ],
  exports: [
    CreateSubscriptionComponent
  ]
})
export class CreateSubscriptionModule { }
