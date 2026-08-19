import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as mapStore from '@store/map';
import { MatButtonToggle } from '@angular/material/button-toggle';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-gridlines-selector',
  templateUrl: './gridlines-selector.component.html',
  styleUrls: ['./gridlines-selector.component.scss'],
  imports: [MatButtonToggle, MatTooltip, MatIcon, TranslateModule],
})
export class GridlinesSelectorComponent {
  private store$ = inject<Store<AppState>>(Store);

  public areGridlinesActive = this.store$.selectSignal(
    mapStore.getAreGridlinesActive,
  );
  public active = false;

  public onToggleGridlines() {
    this.store$.dispatch(new mapStore.SetGridlines(!this.areGridlinesActive()));
  }
}
