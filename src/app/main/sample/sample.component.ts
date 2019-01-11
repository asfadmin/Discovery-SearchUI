import { Component, OnInit } from '@angular/core';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';

import { Store, Action } from '@ngrx/store';

import { combineLatest, Subscription } from 'rxjs';
import { filter, map, switchMap, skip } from 'rxjs/operators';

import { AppState } from './store';
import * as granulesStore from './store/granules';
import * as mapStore from './store/map';
import * as uiStore from './store/ui';
import * as filterStore from './store/filters';

import { AsfApiService, RoutedSearchService, UrlStateService } from './services';
import * as models from './models';

@Component({
  selector   : 'sample',
  templateUrl: './sample.component.html',
  styleUrls  : ['./sample.component.scss']
})
export class SampleComponent implements OnInit {

  public granules$ = this.store$.select(granulesStore.getGranules);
  public loading$  = this.store$.select(granulesStore.getLoading);
  public view$ = this.store$.select(mapStore.getMapView);

  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private routedSearchService: RoutedSearchService,
    private store$: Store<AppState>
  ) {
    this._fuseTranslationLoaderService.loadTranslations(english, turkish);
  }

  public ngOnInit(): void {
    this.routedSearchService.query('');
  }

  public onNewSearch(query: string): void {
    this.routedSearchService.query(query);
  }

  public onClearGranules(): void {
    this.routedSearchService.clear();
    this.store$.dispatch(new granulesStore.ClearGranules());
  }

  public onNewMapView(view: models.MapViewType): void {
    this.store$.dispatch(new mapStore.SetMapView(view));
  }
}
