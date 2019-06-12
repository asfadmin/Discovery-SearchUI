import { Component, OnInit } from '@angular/core';

import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as filtersStore from '@store/filters';


@Component({
  selector: 'app-platform-selector',
  templateUrl: './platform-selector.component.html',
  styleUrls: ['./platform-selector.component.scss']
})
export class PlatformSelectorComponent implements OnInit {
  public platforms$ = this.store$.select(filtersStore.getPlatformsList);
  public selected: string | null = null;

  constructor(private store$: Store<AppState>) { }

  ngOnInit() {
    this.store$.select(filtersStore.getSelectedPlatformName).subscribe(
      selected => this.selected = selected
    );
  }

  public onSelectionChange(platform: string): void {
    this.store$.dispatch(new filtersStore.AddSelectedPlatform(platform));
  }
}
