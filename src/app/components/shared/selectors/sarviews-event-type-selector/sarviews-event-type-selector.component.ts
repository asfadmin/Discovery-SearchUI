import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import { SarviewsEventType } from '@models';
import {
  MatSelectChange,
  MatSelect,
  MatOption,
} from '@angular/material/select';

import * as filterStore from '@store/filters';
import { SubSink } from 'subsink';
import { MatFormField } from '@angular/material/input';
import {} from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sarviews-event-type-selector',
  templateUrl: './sarviews-event-type-selector.component.html',
  styleUrls: ['./sarviews-event-type-selector.component.scss'],
  imports: [MatFormField, MatSelect, MatOption, TranslateModule],
})
export class SarviewsEventTypeSelectorComponent implements OnInit, OnDestroy {
  private store$ = inject<Store<AppState>>(Store);

  public currentEventTypes$ = this.store$.select(
    filterStore.getSarviewsEventTypes,
  );
  public eventTypes = [SarviewsEventType.QUAKE, SarviewsEventType.VOLCANO];

  public selectedTypesList: string[] = [];

  public subs = new SubSink();

  public onNewEventTypes(event: MatSelectChange) {
    const selectedEventNames = event.value as string[];
    const selectedEventTypes: SarviewsEventType[] = Object.keys(
      SarviewsEventType,
    )
      .filter(
        (key) =>
          !!selectedEventNames.find((name) => name === SarviewsEventType[key]),
      )
      .map((key) => SarviewsEventType[key]);

    this.store$.dispatch(
      new filterStore.SetSarviewsEventTypes(selectedEventTypes),
    );
  }

  ngOnInit(): void {
    this.subs.add(
      this.currentEventTypes$.subscribe(
        (types) => (this.selectedTypesList = Object.values(types)),
      ),
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
