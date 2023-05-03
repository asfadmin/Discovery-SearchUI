import '@formatjs/intl-displaynames/polyfill'
import '@formatjs/intl-displaynames/locale-data/en'
import '@formatjs/intl-displaynames/locale-data/es'

import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as searchStore from '@store/search';
import * as models from '@models/index';
import * as services from '@services';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],

})
export class HeaderComponent implements OnInit {
  @Input() isLoading: boolean;

  public searchType$ = this.store$.select(searchStore.getSearchType);
  public searchTypes = models.SearchType;
  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;
  public languageNamesInEnglish = new Intl.DisplayNames(['en'], { type: 'language' });

  constructor(
    private store$: Store<AppState>,
    private screenSize: services.ScreenSizeService,
    public translate: TranslateService,
  ) { }

  ngOnInit() {
  }

  public languageName( langName : string ) {
    return this.languageNamesInEnglish.of( langName );
  }

}
