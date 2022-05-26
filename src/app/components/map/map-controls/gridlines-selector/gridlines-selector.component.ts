import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as mapStore from '@store/map';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-gridlines-selector',
  templateUrl: './gridlines-selector.component.html',
  styleUrls: ['./gridlines-selector.component.scss']
})
export class GridlinesSelectorComponent implements OnInit, OnDestroy {
  public areGridlinesActive$ = this.store$.select(mapStore.getAreGridlinesActive);
  public active = false;

  public subs = new SubSink();

  constructor(private store$: Store<AppState>) { }

  ngOnInit(): void {
    this.subs.add(
      this.areGridlinesActive$.subscribe(active => this.active = active)
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  public onToggleGridlines() {
    this.store$.dispatch(new mapStore.SetGridlines(!this.active));
  }
}
