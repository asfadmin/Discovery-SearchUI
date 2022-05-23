import { Component, Input } from '@angular/core';

import { map } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as uiStore from '@store/ui';
import * as scenesStore from '@store/scenes';

import { Breakpoints, asfWebsite } from '@models';

@Component({
  selector: 'app-attributions',
  templateUrl: './attributions.component.html',
  styleUrls: ['./attributions.component.scss'],
})
export class AttributionsComponent {
  @Input() breakpoint: Breakpoints;

  anio: number = new Date().getFullYear();

  public isResultsMenuOpen$ = this.store$.select(uiStore.getIsResultsMenuOpen);
  public areNoScenes$ = this.store$.select(scenesStore.getScenes).pipe(
    map(scenes => scenes.length === 0)
  );
  public breakpoints = Breakpoints;
  public asfWebsite = asfWebsite;

  constructor(
    private store$: Store<AppState>,
  ) {}

  public onToggleMenu(): void {
    this.store$.dispatch(new uiStore.ToggleResultsMenu());
  }
}
