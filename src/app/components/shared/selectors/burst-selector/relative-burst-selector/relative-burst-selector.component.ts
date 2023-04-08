import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { filter, map } from 'rxjs';
import { SubSink } from 'subsink';

import * as filtersStore from '@store/filters';
import { Store } from '@ngrx/store';
import { AppState } from '@store';

@Component({
  selector: 'app-relative-burst-selector',
  templateUrl: './relative-burst-selector.component.html',
  styleUrls: ['./relative-burst-selector.component.scss']
})
export class RelativeBurstSelectorComponent implements OnInit, OnDestroy {

  private IDsInputUpdated: EventEmitter<string> = new EventEmitter();
  private subs: SubSink = new SubSink();

  constructor(private store$: Store<AppState>) { }

  ngOnInit(): void {
    this.subs.add(
      this.IDsInputUpdated.pipe(
        filter(ids => ids !== null),
        map(ids => ids.split(',').map(data => parseInt(data)))
      ).subscribe(ids => this.updateIDs(ids))
    );

    this.subs.add(
      this.store$.select(filtersStore.getRelativeBurstIDs)
      .subscribe(
        ids => this.updateIDs(ids)
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
    this.store$.dispatch(new filtersStore.setRelativeBurst(ids))
  }
}
