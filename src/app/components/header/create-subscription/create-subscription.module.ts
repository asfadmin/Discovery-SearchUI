import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSelectModule } from '@angular/material/select';

import { CreateSubscriptionComponent } from './create-subscription.component';
import { ProcessingOptionsModule } from '../processing-queue/processing-options';
import { SearchFiltersModule } from '@components/shared/saved-searches/saved-search/search-filters';
import { MatSharedModule } from '@shared';

import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    CreateSubscriptionComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatSelectModule,
    MatSharedModule,
    ProcessingOptionsModule,
    SearchFiltersModule
  ],
  exports: [
    CreateSubscriptionComponent
  ]
})
export class CreateSubscriptionModule { }
