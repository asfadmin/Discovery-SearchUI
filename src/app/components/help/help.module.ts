import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSharedModule } from '@shared';

import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';

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
import { HelpMoreLikeThisComponent } from '@components/help/help-pages/help-more-like-this/help-more-like-this.component';
import { HelpBaselineSearchComponent } from '@components/help/help-pages/help-baseline-search/help-baseline-search.component';
import { HelpSbasSearchComponent } from '@components/help/help-pages/help-sbas-search/help-sbas-search.component';
import { HelpUnzippingComponent } from '@components/help/help-pages/help-unzipping/help-unzipping.component';
import { HelpDownloadQueueComponent } from './help-pages/help-download-queue/help-download-queue.component';
import { HelpExportOptionsComponent } from './help-pages/help-export-options/help-export-options.component';
import { HelpOnDemandComponent } from './help-pages/help-on-demand/help-on-demand.component';
import {MatInputModule} from '@angular/material/input';
import {DocsModalModule} from '@components/shared/docs-modal';


@NgModule({
  declarations: [
    HelpComponent,
    HelpBaselineSearchComponent,
    HelpSbasSearchComponent,
    HelpGeoSearchComponent,
    HelpListSearchComponent,
    HelpSearchResultsComponent,
    HelpTocComponent,
    HelpLoginComponent,
    HelpMapControlsComponent,
    HelpFiltersComponent,
    HelpSavedSearchesComponent,
    HelpNewStuffComponent,
    HelpMoreLikeThisComponent,
    HelpUnzippingComponent,
    HelpDownloadQueueComponent,
    HelpExportOptionsComponent,
    HelpOnDemandComponent,
  ],
    imports: [
        CommonModule,
        MatSharedModule,
        MatTableModule,
        MatSortModule,
        MatInputModule,
        DocsModalModule
    ],
  exports: [
    HelpComponent
  ]
})
export class HelpModule { }
