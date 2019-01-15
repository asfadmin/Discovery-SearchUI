import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TruncateModule } from '@yellowspot/ng-truncate';
import { MatButtonModule, MatCardModule, MatListModule, MatIconModule, MatTooltipModule } from '@angular/material';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { FiltersMenuComponent } from './filters-menu.component';

import { ToggleButtonModule } from './toggle-button';
import { SearchBarModule } from './search-bar';
import { PlatformSelectorModule } from './platform-selector';
import { FilterSelectorModule } from './filter-selector';
import { DateSelectorModule } from './date-selector';
import { PathSelectorModule } from './path-selector';
import { OtherSelectorModule } from './other-selector';

import { ProductsModule } from './products';
import { ProductDetailComponent } from './product-detail/product-detail.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatTooltipModule,

    TruncateModule,
    FontAwesomeModule,

    SearchBarModule,
    ToggleButtonModule,
    ProductsModule,

    FilterSelectorModule,
    PlatformSelectorModule,
    DateSelectorModule,
    PathSelectorModule,
    OtherSelectorModule,
  ],
  declarations: [
    FiltersMenuComponent,
    ProductDetailComponent,
  ],
  exports: [FiltersMenuComponent]
})
export class FiltersMenuModule { }
