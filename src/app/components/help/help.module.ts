import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSharedModule } from '@shared';

import { HelpComponent } from './help.component';

import { HelpGeoSearchComponent } from './help-pages/help-geo-search/help-geo-search.component';
import { HelpListSearchComponent } from './help-pages/help-list-search/help-list-search.component';
import { HelpSearchResultsComponent } from './help-pages/help-search-results/help-search-results.component';
import { HelpTocComponent } from './help-pages/help-toc/help-toc.component';
import { HelpLoginComponent } from './help-pages/help-login/help-login.component';
import { HelpMapControlsComponent } from './help-pages/help-map-controls/help-map-controls.component';
import { HelpFiltersComponent } from './help-pages/help-filters/help-filters.component';
import { HelpSavedSearchesComponent } from './help-pages/help-saved-searches/help-saved-searches.component';
import { HelpNewStuffComponent } from './help-pages/help-new-stuff/help-new-stuff.component';


@NgModule({
  declarations: [
    HelpComponent,
    HelpGeoSearchComponent,
    HelpListSearchComponent,
    HelpSearchResultsComponent,
    HelpTocComponent,
    HelpLoginComponent,
    HelpMapControlsComponent,
    HelpFiltersComponent,
    HelpSavedSearchesComponent,
    HelpNewStuffComponent,
  ],
  imports: [
    CommonModule,
    MatSharedModule,
  ],
  exports: [
    HelpComponent
  ]
})
export class HelpModule { }
