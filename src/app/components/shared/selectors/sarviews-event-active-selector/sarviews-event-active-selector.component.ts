import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Store } from '@ngrx/store';
import { AppState } from '@store';

import * as filtersStore from '@store/filters';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-sarviews-event-active-selector',
  templateUrl: './sarviews-event-active-selector.component.html',
  styleUrls: ['./sarviews-event-active-selector.component.scss']
})
export class SarviewsEventActiveSelectorComponent implements OnInit, OnDestroy {

  public sarviewsEventFilterToggle$ = this.store$.select(filtersStore.getSarviewsEventActiveFilter);
  public filterToggleValue: boolean;

  public subs = new SubSink();

  constructor(private store$: Store<AppState>) { }

  ngOnInit(): void {
    this.subs.add(
      this.sarviewsEventFilterToggle$.subscribe(
        val => this.filterToggleValue = val
      )
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  public voidOnToggle(val: MatSlideToggleChange) {
    this.store$.dispatch(new filtersStore.SetSarviewsEventActiveFilter(val.checked));
  }
}
