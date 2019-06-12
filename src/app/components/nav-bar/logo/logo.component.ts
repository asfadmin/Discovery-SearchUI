import { Component, OnInit } from '@angular/core';

import * as uiStore from '@store/ui';
import { Store } from '@ngrx/store';
import { AppState } from '@store/app.reducer';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent implements OnInit {

  public isSidebarOpen$ = this.store$.select(uiStore.getIsSidebarOpen);

  constructor(
    private store$: Store<AppState>,
  ) {}

  ngOnInit(): void {
  }

  public onToggleHide(): void {
    this.store$.dispatch(new uiStore.ToggleSidebar());
  }

}
