import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import { SubSink } from 'subsink';
import * as filtersStore from '@store/filters';

@Component({
  selector: 'app-sbas-overlap-selector',
  templateUrl: './sbas-overlap-selector.component.html',
  styleUrls: ['./sbas-overlap-selector.component.scss']
})
export class SbasOverlapSelectorComponent implements OnInit {

  public fiftyPercentOverlapToggled = false;
  private subs = new SubSink();

  constructor(private store$: Store<AppState>) { }

  ngOnInit(): void {
    this.subs.add(
      this.store$.select(filtersStore.getSBASOverlapToggle).subscribe(
        toggledOn => this.fiftyPercentOverlapToggled = toggledOn
      )
    );
  }

  public onChange(): void {
    this.store$.dispatch(new filtersStore.Toggle50PercentOverlap());
  }

}
