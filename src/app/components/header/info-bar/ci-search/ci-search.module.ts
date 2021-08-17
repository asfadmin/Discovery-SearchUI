import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CiSearchComponent } from './ci-search.component';


@NgModule({
  declarations: [
    CiSearchComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CiSearchComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class CiSearchModule { }
