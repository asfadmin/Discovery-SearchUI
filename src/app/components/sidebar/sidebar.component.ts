import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import * as models from '@models';
import { AppState } from '@store';
import * as uiStore from '@store/ui';

import { SaveUserFiltersComponent } from './save-user-filters/save-user-filters.component';
import { SavedSearchesComponent } from './saved-searches/saved-searches.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [SavedSearchesComponent, SaveUserFiltersComponent],
})
export class SidebarComponent {
  private store$ = inject<Store<AppState>>(Store);

  public sidebar = this.store$.selectSignal(uiStore.getSidebar);
  public SidebarType = models.SidebarType;

  public onCloseSidebar(): void {
    this.store$.dispatch(new uiStore.CloseSidebar());
  }
}
