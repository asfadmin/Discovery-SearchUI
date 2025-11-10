import '@formatjs/intl-displaynames/polyfill';
import '@formatjs/intl-displaynames/locale-data/en';
import '@formatjs/intl-displaynames/locale-data/es';

import { Component, Input, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as searchStore from '@store/search';
import * as models from '@models/index';
import * as services from '@services';
import { TranslateService } from '@ngx-translate/core';
import { LogoComponent } from './logo/logo.component';
import { DatasetHeaderComponent } from './dataset-header/dataset-header.component';
import { TimeseriesHeaderComponent } from './timeseries-header/timeseries-header.component';
import { ListHeaderComponent } from './list-header/list-header.component';
import { BaselineHeaderComponent } from './baseline-header/baseline-header.component';
import { SarviewsHeaderComponent } from './sarviews-header/sarviews-header.component';
import { Hyp3HeaderComponent } from './hyp3-header/hyp3-header.component';
import { InfoBarComponent } from './info-bar/info-bar.component';
import { MatProgressBar } from '@angular/material/progress-bar';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    LogoComponent,
    DatasetHeaderComponent,
    TimeseriesHeaderComponent,
    ListHeaderComponent,
    BaselineHeaderComponent,
    SarviewsHeaderComponent,
    Hyp3HeaderComponent,
    InfoBarComponent,
    MatProgressBar,
    AsyncPipe,
  ],
})
export class HeaderComponent {
  private store$ = inject<Store<AppState>>(Store);
  private screenSize = inject(services.ScreenSizeService);
  translate = inject(TranslateService);

  @Input() isLoading: boolean;

  public searchType$ = this.store$.select(searchStore.getSearchType);
  public searchTypes = models.SearchType;
  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;
  public languageNamesInEnglish = new Intl.DisplayNames(['en'], {
    type: 'language',
  });

  public languageName(langName: string) {
    return this.languageNamesInEnglish.of(langName);
  }
}
