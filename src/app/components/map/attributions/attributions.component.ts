import { Component, OnInit, Input } from '@angular/core';

import { map } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as uiStore from '@store/ui';
import * as scenesStore from '@store/scenes';

import { LonLat, Breakpoints } from '@models';
import { ScreenSizeService } from '@services';

@Component({
  selector: 'app-attributions',
  templateUrl: './attributions.component.html',
  styleUrls: ['./attributions.component.scss'],
})
export class AttributionsComponent {
  anio: number = new Date().getFullYear();

  public isResultsMenuOpen$ = this.store$.select(uiStore.getIsResultsMenuOpen);
  public areNoScenes$ = this.store$.select(scenesStore.getScenes).pipe(
    map(scenes => scenes.length === 0)
  );

  constructor(
    private store$: Store<AppState>,
    private screenSize: ScreenSizeService
  ) {}

  public onToggleMenu(): void {
    this.store$.dispatch(new uiStore.ToggleResultsMenu());
  }
}
