import { Component, inject } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as searchStore from '@store/search';

@Component({
    selector: 'app-clear-button',
    templateUrl: './clear-button.component.html',
    styleUrls: ['./clear-button.component.css'],
    standalone: false
})
export class ClearButtonComponent {
  private store$ = inject<Store<AppState>>(Store);

  public onClearSearch(): void {
    this.store$.dispatch(new searchStore.ClearSearch());
  }
}
