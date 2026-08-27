import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { AppState } from '@store';
import * as searchStore from '@store/search';

@Component({
  selector: 'app-clear-button',
  templateUrl: './clear-button.component.html',
  styleUrls: ['./clear-button.component.css'],
  imports: [MatButton, TranslateModule],
})
export class ClearButtonComponent {
  private store$ = inject<Store<AppState>>(Store);

  public onClearSearch(): void {
    this.store$.dispatch(new searchStore.ClearSearch());
  }
}
