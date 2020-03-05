import { Component, OnInit, Input } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as scenesStore from '@store/scenes';

import { Observable } from 'rxjs';


@Component({
  selector: 'app-desktop-results-menu',
  templateUrl: './desktop-results-menu.component.html',
  styleUrls: ['./desktop-results-menu.component.css', '../results-menu.component.scss']
})
export class DesktopResultsMenuComponent implements OnInit {
  @Input() resize$: Observable<void>;

  public selectedProducts$ = this.store$.select(scenesStore.getSelectedSceneProducts);

  constructor(
    private store$: Store<AppState>,
  ) { }

  ngOnInit(): void {
  }
}
