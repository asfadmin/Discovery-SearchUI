import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@store';

import * as filtersStore from '@store/filters';

@Component({
  selector: 'app-sarviews-event-active-selector',
  templateUrl: './sarviews-event-active-selector.component.html',
  styleUrls: ['./sarviews-event-active-selector.component.scss']
})
export class SarviewsEventActiveSelectorComponent implements OnInit {

  constructor(
    private store$: Store<AppState>
  ) { }

  ngOnInit(): void {
  }

  public voidOnToggle(val: Event) {
    this.store$.dispatch(new filtersStore.SetSarviewsEventActiveFilter(val.returnValue));
  }
}
