import { Component, OnInit, Input } from '@angular/core';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as scenesStore from '@store/scenes';

enum MobileViews {
  LIST = 0,
  DETAIL = 1
}


@Component({
  selector: 'app-mobile-results-menu',
  templateUrl: './mobile-results-menu.component.html',
  styleUrls: ['./mobile-results-menu.component.css', '../results-menu.component.scss']
})
export class MobileResultsMenuComponent implements OnInit {
  @Input() resize$: Observable<void>;

  public view = MobileViews.LIST;
  public Views = MobileViews;

  public selectedProducts$ = this.store$.select(scenesStore.getSelectedSceneProducts);

  constructor(
    private store$: Store<AppState>,
  ) { }

  ngOnInit(): void {
  }

  public onSelectList(): void {
    this.view = MobileViews.LIST;
  }

  public onSelectDetail(): void {
    this.view = MobileViews.DETAIL;
  }
}
