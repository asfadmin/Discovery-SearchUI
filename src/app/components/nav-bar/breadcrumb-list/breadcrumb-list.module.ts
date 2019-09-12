import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BreadcrumbListComponent } from './breadcrumb-list.component';

@NgModule({
  declarations: [BreadcrumbListComponent],
  imports: [
    CommonModule,
  ],
  exports: [BreadcrumbListComponent]
})
export class BreadcrumbListModule { }
