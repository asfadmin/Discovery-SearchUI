import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import * as searchStore from '@store/search';

import { SearchType } from '@models';
import { ScenesService } from '@services';


@Component({
  selector: 'app-desktop-results-menu',
  templateUrl: './desktop-results-menu.component.html',
  styleUrls: ['./desktop-results-menu.component.css', '../results-menu.component.scss']
})
export class DesktopResultsMenuComponent implements OnInit, OnDestroy {
  @Input() resize$: Observable<void>;

  public selectedProducts$ = this.store$.select(scenesStore.getSelectedSceneProducts);
  public searchType: SearchType;
  public SearchTypes = SearchType;
  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
  ) { }

  ngOnInit(): void {
    this.subs.add(
      this.store$.select(searchStore.getSearchType).subscribe(
        searchType => this.searchType = searchType
      )
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
