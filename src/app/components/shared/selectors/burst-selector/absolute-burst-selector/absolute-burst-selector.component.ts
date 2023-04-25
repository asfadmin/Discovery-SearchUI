import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { debounceTime, filter, map } from 'rxjs';
import { SubSink } from 'subsink';

import * as filtersStore from '@store/filters';
import { Store } from '@ngrx/store';
import { AppState } from '@store';

@Component({
  selector: 'app-absolute-burst-selector',
  templateUrl: './absolute-burst-selector.component.html',
  styleUrls: ['./absolute-burst-selector.component.scss',  '../burst-selector.component.scss']
})
export class AbsoluteBurstSelectorComponent implements OnInit, OnDestroy {

  private IDsInputUpdated: EventEmitter<string> = new EventEmitter();
  private subs: SubSink = new SubSink();

  public absoluteIDs
  constructor(private store$: Store<AppState>) { }

  ngOnInit(): void {
    this.subs.add(
      this.IDsInputUpdated.pipe(
        debounceTime(3.0),
        map(ids => {
          const idsArray = ids.trim().split(',')
          if (idsArray.length > 0) {
            const intIDs = idsArray.map(data => parseInt(data))
            return intIDs.filter(data => !isNaN(data))
          } else {
            return []
          }
        }),
        filter(ids => ids !== this.absoluteIDs)
      ).subscribe(ids => this.updateIDs(ids))
    );

    this.subs.add(
      this.store$.select(filtersStore.getAbsoluteBurstIDs)
      .subscribe(
        ids => this.absoluteIDs = ids
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

  private updateIDs(ids: number[]) {
    this.store$.dispatch(new filtersStore.setAbsoluteBurst(ids))
  }
}
