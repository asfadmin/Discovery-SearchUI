import { Component, OnInit, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as uiStore from '@store/ui';
import { TitleCasePipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { HelpTocComponent } from './help-pages/help-toc/help-toc.component';
import { HelpGeoSearchComponent } from './help-pages/help-geo-search/help-geo-search.component';
import { HelpListSearchComponent } from './help-pages/help-list-search/help-list-search.component';
import { HelpSearchResultsComponent } from './help-pages/help-search-results/help-search-results.component';
import { HelpLoginComponent } from './help-pages/help-login/help-login.component';
import { HelpMapControlsComponent } from './help-pages/help-map-controls/help-map-controls.component';
import { HelpFiltersComponent } from './help-pages/help-filters/help-filters.component';
import { HelpSavedSearchesComponent } from './help-pages/help-saved-searches/help-saved-searches.component';
import { HelpNewStuffComponent } from './help-pages/help-new-stuff/help-new-stuff.component';
import { HelpDownloadQueueComponent } from './help-pages/help-download-queue/help-download-queue.component';
import { HelpExportOptionsComponent } from './help-pages/help-export-options/help-export-options.component';
import { HelpMoreLikeThisComponent } from './help-pages/help-more-like-this/help-more-like-this.component';
import { HelpBaselineSearchComponent } from './help-pages/help-baseline-search/help-baseline-search.component';
import { HelpSbasSearchComponent } from './help-pages/help-sbas-search/help-sbas-search.component';
import { HelpOnDemandComponent } from './help-pages/help-on-demand/help-on-demand.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
  imports: [
    MatButton,
    HelpTocComponent,
    HelpGeoSearchComponent,
    HelpListSearchComponent,
    HelpSearchResultsComponent,
    HelpLoginComponent,
    HelpMapControlsComponent,
    HelpFiltersComponent,
    HelpSavedSearchesComponent,
    HelpNewStuffComponent,
    HelpDownloadQueueComponent,
    HelpExportOptionsComponent,
    HelpMoreLikeThisComponent,
    HelpBaselineSearchComponent,
    HelpSbasSearchComponent,
    HelpOnDemandComponent,
    TitleCasePipe,
    TranslateModule,
  ],
})
export class HelpComponent implements OnInit {
  private dialogRef = inject<MatDialogRef<HelpComponent>>(MatDialogRef);
  private store$ = inject<Store<AppState>>(Store);

  public topic: string;

  ngOnInit(): void {
    this.store$
      .select(uiStore.getHelpDialogTopic)
      .subscribe((topic) => (this.topic = topic));
  }

  public setHelpTopic(topic: string): void {
    this.store$.dispatch(new uiStore.SetHelpDialogTopic(topic));
  }

  public onClose(): void {
    this.dialogRef.close();
  }
}
