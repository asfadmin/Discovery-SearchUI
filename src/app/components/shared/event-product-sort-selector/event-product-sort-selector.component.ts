import { Component, OnInit } from '@angular/core';
import { EventProductSortDirection, EventProductSortType } from '@models';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import { getSarviewsEventProductSorting, SetEventProductSorting } from '@store/filters';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-event-product-sort-selector',
  templateUrl: './event-product-sort-selector.component.html',
  styleUrls: ['./event-product-sort-selector.component.scss']
})
export class EventProductSortSelectorComponent implements OnInit {

  private subs = new SubSink();

  public sortType: EventProductSortType = EventProductSortType.DATE;
  public sortTypeDisplay: string;
  public sortDirection: EventProductSortDirection = EventProductSortDirection.DESCENDING;

  public sortTypes = Object.values(EventProductSortType);
  public sortDirections = Object.values(EventProductSortDirection);
  public sortDescending = true;

  constructor(private store$: Store<AppState>) { }

  ngOnInit(): void {
    this.subs.add(
      this.store$.select(getSarviewsEventProductSorting).subscribe(
        sorting => {
          this.sortType = sorting.sortType;
          this.sortTypeDisplay = this.sortType.valueOf();
          this.sortDirection = sorting.sortDirection;

          this.sortDescending = this.sortDirection === EventProductSortDirection.DESCENDING;
        }
      )
    );
  }

  public onSetSortDirection() {
    this.sortDescending = !this.sortDescending;
    this.sortDirection = this.sortDescending ? EventProductSortDirection.DESCENDING : EventProductSortDirection.ASCENDING;
    this.store$.dispatch(new SetEventProductSorting({sortDirection: this.sortDirection, sortType: this.sortType}));
  }

  public onSetSortType(value: string) {
    let sortType = EventProductSortType.DATE;
    switch (value) {
      case EventProductSortType.PATH.valueOf():
        sortType = EventProductSortType.PATH;
        break;
      case EventProductSortType.FRAME.valueOf():
        sortType = EventProductSortType.FRAME;
        break;
      default:
        sortType = EventProductSortType.DATE;
        break;
    }

    this.store$.dispatch(new SetEventProductSorting({sortDirection: this.sortDirection, sortType}));
  }
}
