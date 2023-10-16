import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { debounceTime, filter, map } from 'rxjs';
import { SubSink } from 'subsink';

import * as filtersStore from '@store/filters';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
@Component({
  selector: 'app-opera-burst-id-selector',
  templateUrl: './opera-burst-id-selector.component.html',
  styleUrls: ['./opera-burst-id-selector.component.scss']
})
export class OperaBurstIdSelectorComponent implements OnInit, OnDestroy {
  public operaBurstIDs: string[] = []
  private IDsInputUpdated: EventEmitter<string> = new EventEmitter();
  private subs: SubSink = new SubSink();

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
        filter(ids => ids !== this.operaBurstIDs)
      ).subscribe(ids => this.updateIDs(ids))
    );

    this.subs.add(
      this.store$.select(filtersStore.getOperaBurstIDs)
      .subscribe(
        ids => this.operaBurstIDs = ids
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
    this.store$.dispatch(new filtersStore.setOperaBurstID(ids))
  }
}
