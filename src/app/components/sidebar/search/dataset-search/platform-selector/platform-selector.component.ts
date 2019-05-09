import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import { Platform } from '@models';
import * as filtersStore from '@store/filters';


@Component({
  selector: 'app-platform-selector',
  templateUrl: './platform-selector.component.html',
  styleUrls: ['./platform-selector.component.scss']
})
export class PlatformSelectorComponent implements OnInit {
  public selected: string | null = null;

  public platforms$ = this.store$.select(filtersStore.getPlatformsList);
  public selectedPlatformName$ = this.store$.select(filtersStore.getSelectedPlatformNames).pipe(
    map(platform => platform.size === 1 ?
      platform.values().next().value : null
    )
  );

  constructor(private store$: Store<AppState>) { }

  ngOnInit() {
    this.selectedPlatformName$.subscribe(
      selected => this.selected = selected
    );
  }

  public onSelectionChange(platform: string): void {
    this.store$.dispatch(new filtersStore.AddSelectedPlatform(platform));
  }
}
