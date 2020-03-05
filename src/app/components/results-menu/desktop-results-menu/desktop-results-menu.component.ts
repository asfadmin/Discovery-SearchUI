import { Component, OnInit, Input } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import * as searchStore from '@store/search';

import { Observable } from 'rxjs';
import { SearchType } from '@models';


@Component({
  selector: 'app-desktop-results-menu',
  templateUrl: './desktop-results-menu.component.html',
  styleUrls: ['./desktop-results-menu.component.css', '../results-menu.component.scss']
})
export class DesktopResultsMenuComponent implements OnInit {
  @Input() resize$: Observable<void>;

  public selectedProducts$ = this.store$.select(scenesStore.getSelectedSceneProducts);
  public searchType: SearchType;
  public SearchTypes = SearchType;

  constructor(
    private store$: Store<AppState>,
  ) { }

  ngOnInit(): void {
    this.store$.select(searchStore.getSearchType).subscribe(
      searchType => this.searchType = searchType
    );
  }
}
