import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LogoModule } from '@components/nav-bar/logo/logo.module';
import { AdditionalFiltersModule } from '@components/additional-filters';
import { SearchSelectorModule } from '@components/shared/selectors/search-selector';

import { SidebarComponent } from './sidebar.component';

@NgModule({
  declarations: [ SidebarComponent ],
  imports: [
    CommonModule,
    LogoModule,
    SearchSelectorModule,
  ],
  exports: [ SidebarComponent ]
})
export class SidebarModule { }
