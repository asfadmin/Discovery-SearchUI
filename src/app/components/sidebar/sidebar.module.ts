import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SavedSearchesModule } from './saved-searches';
import { SaveUserFiltersModule } from './save-user-filters';

import { SidebarComponent } from './sidebar.component';

@NgModule({
  declarations: [
    SidebarComponent
  ],
  imports: [
    CommonModule,
    SavedSearchesModule,
    SaveUserFiltersModule,
  ],
  exports: [
    SidebarComponent
  ]
})
export class SidebarModule { }
