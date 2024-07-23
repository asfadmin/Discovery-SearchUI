import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { debounceTime, filter, map } from 'rxjs';
import { SubSink } from 'subsink';
import * as searchStore from '@store/search';

import * as filtersStore from '@store/filters';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import { SearchType } from '@models';
@Component({
  selector: 'app-full-burst-selector',
  templateUrl: './full-burst-selector.component.html',
  styleUrls: ['./full-burst-selector.component.scss', '../burst-selector.component.scss']
})
export class FullBurstSelectorComponent implements OnInit, OnDestroy {
  public fullBurstIDs: string[] = []
  private IDsInputUpdated: EventEmitter<string> = new EventEmitter();
  private subs: SubSink = new SubSink();

  public searchType$ = this.store$.select(searchStore.getSearchType);
  public searchTypes = SearchType;
  constructor(private store$: Store<AppState>) { }

  ngOnInit(): void {
    this.subs.add(
      this.IDsInputUpdated.pipe(
        debounceTime(3.0),
        filter(ids => ids !== null),
        map(ids => {
          const idsArray = ids.split(',').map(id => id.trim());
          return idsArray.filter(entry => entry.length > 0);
        }),
        filter(ids => ids !== this.fullBurstIDs)
      ).subscribe(ids => this.updateIDs(ids))
    );

    this.subs.add(
      this.store$.select(filtersStore.getFullBurstIDs)
      .subscribe(
        ids => this.fullBurstIDs = ids
      )
    );
  }

  ngOnDestroy(): void {
      this.subs.unsubscribe()
  }

  public onChange(event: Event) {
    const text = (event.target as HTMLInputElement).value
    this.IDsInputUpdated.emit(text)
  }

  private updateIDs(ids: string[]) {
    this.store$.dispatch(new filtersStore.setFullBurst(ids))
  }
}
