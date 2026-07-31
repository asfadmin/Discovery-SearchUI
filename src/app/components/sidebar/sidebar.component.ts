import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { SubSink } from 'subsink';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as uiStore from '@store/ui';

import * as models from '@models';
import { SavedSearchesComponent } from './saved-searches/saved-searches.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [SavedSearchesComponent],
})
export class SidebarComponent implements OnInit, OnDestroy {
  private store$ = inject<Store<AppState>>(Store);

  public sidebar: models.SidebarType;
  public SidebarType = models.SidebarType;

  private subs = new SubSink();

  ngOnInit(): void {
    this.subs.add(
      this.store$.select(uiStore.getSidebar).subscribe((sidebar) => {
        this.sidebar = sidebar;
      }),
    );
  }

  public onCloseSidebar(): void {
    this.store$.dispatch(new uiStore.CloseSidebar());
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
