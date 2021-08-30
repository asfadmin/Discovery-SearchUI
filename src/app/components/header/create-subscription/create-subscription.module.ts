import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSelectModule } from '@angular/material/select';
import { MatSharedModule } from '@shared';

import { SearchFiltersModule } from '@components/sidebar/saved-searches/saved-search/search-filters';

import { CreateSubscriptionComponent } from './create-subscription.component';
import { ProcessingOptionsModule } from '../processing-queue/processing-options';

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
