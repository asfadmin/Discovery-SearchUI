import { Component, OnInit } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
// import { MatSelectChange } from '@angular/material/select';
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

  sortType: EventProductSortType = EventProductSortType.DATE;
  sortDirection: EventProductSortDirection = EventProductSortDirection.DESCENDING;

  sortTypes = Object.values(EventProductSortType);
  sortDirections = Object.values(EventProductSortDirection);

  constructor(private store$: Store<AppState>) { }

  ngOnInit(): void {
    this.subs.add(
      this.store$.select(getSarviewsEventProductSorting).subscribe(
        sorting => {
          this.sortType = sorting.sortType;
          this.sortDirection = sorting.sortDirection;
        }
      )
    );
  }

  public onSetSortDirection(event: MatButtonToggleChange) {
    const sortDirection = event.value.length > 0 ? EventProductSortDirection.DESCENDING : EventProductSortDirection.ASCENDING;
    this.store$.dispatch(new SetEventProductSorting({sortDirection, sortType: this.sortType}));
  }

  public onSetSortType(event: MatButtonToggleChange) {
    let sortType = EventProductSortType.DATE;
    switch (event.value) {
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
