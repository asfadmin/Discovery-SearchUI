import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { SearchType } from '@models';
import { AppState } from '@store';
import * as filtersStore from '@store/filters';
import * as searchStore from '@store/search';
import * as uiStore from '@store/ui';

@Component({
  selector: 'app-cancel-filter-changes',
  templateUrl: './cancel-filter-changes.component.html',
  styleUrls: ['./cancel-filter-changes.component.scss'],
  imports: [MatButton, TranslateModule],
})
export class CancelFilterChangesComponent {
  private store$ = inject<Store<AppState>>(Store);

  private searchType = this.store$.selectSignal(searchStore.getSearchType);

  public onCancelFiltersChange(): void {
    if (this.searchType() === SearchType.LIST) {
      this.store$.dispatch(new filtersStore.ClearListFilters());
    }

    this.store$.dispatch(new filtersStore.RestoreFilters());
    this.store$.dispatch(new filtersStore.StoreCurrentFilters());
    this.store$.dispatch(new uiStore.CloseFiltersMenu());
  }
}
